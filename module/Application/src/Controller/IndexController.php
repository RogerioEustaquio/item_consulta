<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    public function loginAction()
    {
        exit;
    }

    public function indexAction()
    {
        $view = new ViewModel();
        return $view;
    }

    public function adminAction()
    {
        $this->layout()->setTemplate('layout/admin.phtml');    
        
        $view = new ViewModel();
        return $view;
    }

}
