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

    public function getIp(){
        $ip = null;
        if(getenv('REMOTE_ADDR') !== '::1')
            $ip = getenv('REMOTE_ADDR');
        else {
            $ip = gethostbyname(trim(`hostname`));
        }

        return $ip;
    }

    public function loginAction()
    {
        $client = new Client('http://10.1.12.43/get_session.php?ip='.$this->getIp());
        $response = $client->send();
        $json = $response->getContent();
        $info = json_decode($json);
        
        if($info){
            $this->plugin('SessionPlugin')->setSession($info);
            echo json_encode(array(
                "success" => true,
                "usuario" => $info,
                "msg" => "Usuário logado no sistema."
            ));
        } else {
            echo json_encode(array(
                "success" => false,
                "msg" => "Usuário não logado no sistema."
            ));
        }
        
        exit;
    }
    
}
