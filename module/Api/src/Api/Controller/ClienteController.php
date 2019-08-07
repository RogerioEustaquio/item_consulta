<?php
namespace Api\Controller;

use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Core\Mvc\Controller\AbstractRestfulController;
use Api\Service\ClienteService;

// http://hounddog.github.io/blog/getting-started-with-rest-and-zend-framework-2/
// https://samsonasik.wordpress.com/2012/10/31/zend-framework-2-step-by-step-create-restful-application/
// https://adelartiemannjunior.wordpress.com/2014/08/09/mao-na-massa-restful-e-zend-framework-2/

class ClienteController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }
    
    public function teste2Action()
    {
        $success = true;
        $message = "";
        $data = null;
        
        $params = $this->getJsonParams();
        
        try {
            $em = $this->getEntityManager();
            
            
            $sql = "
              select id_empresa, nome from ms.empresa 
               where apelido = '".$_REQUEST['empresa']."'
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            
            $data = $stmt->fetchAll();
            
        } catch (\Exception $e) {
            $success = false;
            $message = $e->getMessage();
        }
        
        $json = new JsonModel($data);
        return $this->getResponseWithHeader()->setContent($json->serialize());
    }
    
    
}
