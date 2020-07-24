<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Core\Mvc\Controller\AbstractRestfulController;
use Zend\Http\Client;
use Core\Ad\adLDAPFactory;
use Zend\Json\Json;
use Zend\Db\ResultSet\HydratingResultSet;
use Core\Stdlib\StdClass;
use Core\Hydrator\ObjectProperty;
use Core\Hydrator\Strategy\ValueStrategy;

class IndexController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }

    public function getIp(){
        $ip = null;
        if(getenv('REMOTE_ADDR') !== '::1')
            $ip = getenv('REMOTE_ADDR');
        else {
            $ip = gethostbyname(trim(`hostname`));
        }

        return $ip;
    }

    // public function loginAction()
    // {
    //     $client = new Client('http://10.1.12.43/get_session.php?ip='.$this->getIp());
    //     $response = $client->send();
    //     $json = $response->getContent();
    //     $info = json_decode($json);
        
    //     if($info){
    //         $this->plugin('SessionPlugin')->setSession($info);
    //         echo json_encode(array(
    //             "success" => true,
    //             "usuario" => $info,
    //             "msg" => "Usuário logado no sistema."
    //         ));
    //     } else {
    //         echo json_encode(array(
    //             "success" => false,
    //             "msg" => "Usuário não logado no sistema."
    //         ));
    //     }
        
    //     exit;
    // }

    public function loginAction()
    {

        $info = $this->plugin('SessionPlugin')->getSession();

        if($info){

            echo json_encode(array(
                "success" => true,
                "usuario" => $info,
                "msg" => "Usuário logado no sistema."
            ));
        } else {
            echo json_encode(array(
                "success" => false,
                "usuario" => '',
                "msg" => "Usuário não logado no sistema."
            ));
        }
        
        exit;
    }

    public function usuario($cpf)
    {   
        $data = array();
        
        try {
            $em = $this->getEntityManager();
            
            $sql = "select f.id_pessoa id,
                           f.id_empresa,
                           e.apelido empresa,
                           f.usuario_sistema,
                           to_char(sysdate,'dd/mm/yyyy') data
                        from ms.ff_funcionario f,
                             ms.empresa e
                    where f.id_pessoa = :cpf
                    and f.id_empresa = e.id_empresa
                    and f.data_saida is null 
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':cpf', $cpf);
            $stmt->execute();
            
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            // $hydrator->addStrategy('frete_rat', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $data = null;
        }
        
        return $data;
    }

    public function logarAction()
    {
        $AD_SERVER = '10.1.12.11';

        $ldap_server = $this->params()->fromPost('server',null);
        $auth_user = $this->params()->fromPost('user',null);
        $auth_pass = $this->params()->fromPost('pass',null);

        if(!$ldap_server){
            $ldap_server = $AD_SERVER;
        }

        $msg = '';
        $success = true;

        try {

            $userParam = strtolower($auth_user);
            $passParam = $auth_pass;

            $isMail = strpos($userParam, '@') ? strpos($userParam, '@') : strlen($userParam);
            $username = substr($userParam, 0, $isMail);
			
			$adldap = new adLDAPFactory;
            $infoUserAD = $adldap->getInfoCollection($username);

            if (!$infoUserAD->description) {
                throw new \Exception('Usuário incorreto!');
            }

            if (!$adldap->authenticate($username, $passParam)) {
                throw new \Exception('Senha incorreta!');
            }
            
            $info = $adldap->getInfo($username);

            $cpf = intval($info[0]['description'][0]);

            $dataUsuario = $this->usuario($cpf);

            if($dataUsuario){
                $this->plugin('SessionPlugin')->setSession($dataUsuario[0]);
            }else{
                $msg = 'Funcionário não cadastrado';
                $success = false;
            }

        } catch (\Exception $e) {
            $msg = $e->getMessage();
            $success = false;
        }
		
        return new JsonModel(array(
            "msg" => $msg . '... ' . $infoUserAD->description,
            "success" => $success
        ));
    }
    
}
