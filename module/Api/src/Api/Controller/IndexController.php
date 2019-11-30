<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Core\Mvc\Controller\AbstractRestfulController;
use Zend\Http\Client;

class IndexController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }

    public function loginAction()
    {
        $client = new Client('http://10.1.12.43/get_session.php');
        $response = $client->send();
        
        $json = $response->getContent();
        $info = json_decode($json);
        
        if($info){
            $this->plugin('SessionPlugin')->setSession($info);
        }
        
        exit;
    }

    public function testeloginAction()
    {
        $session = $this->getSession();
        var_dump($session['info']->usuario_sistema);
        
        exit;
    }

    public function testesessionAction()
    {   
        $client = new Client('http://10.1.12.43/get_session.php');
        $response = $client->send();
        
        $json = $response->getContent();
        var_dump(json_decode($json));

        exit;
    }

    public function testeAction()
    {   
        $data = array();
        
        try {
            $em = $this->getEntityManager();
            
            $sql = "
                select emp, cod_item, descricao, marca, estoque_qtde as estoque, pa.preco 
                  from pricing.vm_produto_preco_analise pa
                 where pa.emp = 'AP'
                   and pa.curva_nbs = 'I'
                   and pa.estoque_qtde > 0
                   and rownum <= 5
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            // $stmt->bindValue(1, $this->params()->fromQuery('empresa',null));
            // $stmt->bindValue(2, $this->params()->fromQuery('codItem',null));
            $stmt->execute();
            

            $this->setCallbackData($stmt->fetchAll());
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }
    
}
