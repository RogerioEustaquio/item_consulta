<?php
namespace Core\Mvc\Controller;

use Zend\Mvc\Controller\AbstractRestfulController as AbstractController;
use Zend\View\Model\JsonModel;
use Zend\Http\PhpEnvironment\Response;

// http://hounddog.github.io/blog/getting-started-with-rest-and-zend-framework-2/
// https://samsonasik.wordpress.com/2012/10/31/zend-framework-2-step-by-step-create-restful-application/
// https://adelartiemannjunior.wordpress.com/2014/08/09/mao-na-massa-restful-e-zend-framework-2/

class AbstractRestfulController extends AbstractController
{
    
    protected $em = null;
    protected $callback = array('success' => true, 'message' => null, 'data' => array());
    
    public function getEntityManager(){
        return $this->getEvent()->getApplication()->getServiceManager()->get('Doctrine\ORM\EntityManager');
    }
    
    protected function getJsonParams(){
        //$allParams = $this->params()->fromQuery(); 
        $requestContent = $this->getRequest()->getContent();
        $params = json_decode($requestContent,true);
        return $params;
    }
    
    /**
     * Retorna o json model do array
     * @param array $data Dados a serem formatados para retorno
     * @return JsonModel
     */
    protected function jsonModel($data = array()){
        return new JsonModel($data);
    }

    protected function setCallbackData($data = array()){
        $this->callback['success'] = true;
        $this->callback['data'] = $data;
    }

    protected function setCallbackError($message){
        $this->callback['success'] = false;
        $this->callback['message'] = $message;
    }
    
    protected function getCallback(){
        return $this->callback;
    }

    protected function getCallbackModel(){
        return $this->jsonModel($this->getCallback());
    }
}
