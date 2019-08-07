<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\MvcEvent;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class PerformanceController extends AbstractActionController
{
    
    /** 
     * We override the parent class' onDispatch() method to
     * set an alternative layout for all actions in this controller.
    */
    public function onDispatch(MvcEvent $e) 
    {
        // Call the base class' onDispatch() first and grab the response
        $response = parent::onDispatch($e);        
        
        // Set alternative layout
        $this->layout()->setTemplate('layout/admin.phtml');                
        
        // Return the response
        return $response;
    }

    public function __construct()
    {   
        
    }

    public function indexAction()
    {
        return new ViewModel();
    }

    public function vendadiaAction()
    {
        return new ViewModel();
    }

    public function vendamesAction()
    {
        return new ViewModel();
    }
}
