<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Api\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Zend\Http\Client as HttpClient;

use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;

use Api\Entity\Pessoa;

class IndexController extends AbstractActionController
{
//    protected $_cache;
//    public function __construct(Pessoa $cache = null)
//    {
//        if (!is_null($cache)) {
//            $this->_cache = $cache;
//        }
//
//        var_dump(isset($cache));
//    }

    public function indexAction()
    {
        $this->getEvent()->getApplication()->getServiceManager();
        // $em = $this->getServiceLocator()->get('doctrine.entitymanager.orm_default');
        // $product = $entityManager->find('Pessoa', 1);
//        return new JsonModel();
         return new ViewModel();
    }
}
