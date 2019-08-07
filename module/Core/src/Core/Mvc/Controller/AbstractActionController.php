<?php
namespace Core\Mvc\Controller;

use Zend\Mvc\Controller\AbstractActionController as AbstractController;
use Zend\View\Model\JsonModel;
use Zend\Http\PhpEnvironment\Response;

// http://hounddog.github.io/blog/getting-started-with-rest-and-zend-framework-2/
// https://samsonasik.wordpress.com/2012/10/31/zend-framework-2-step-by-step-create-restful-application/
// https://adelartiemannjunior.wordpress.com/2014/08/09/mao-na-massa-restful-e-zend-framework-2/

class AbstractActionController extends AbstractController
{
    protected $em = null;
    
    public function getEntityManager(){
        return $this->getEvent()->getApplication()->getServiceManager()->get('Doctrine\ORM\EntityManager');
    }
}
