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
        $redirectUrl = 'http://10.2.7.18';
        $sessionParam = $this->params()->fromQuery('s',null);
        if($sessionParam){
            $session = json_decode(base64_decode($sessionParam));

            if(isset($session->info)) $this->plugin('SessionPlugin')->setSession($session); 
            else $redirectUrl = 'http://sistemas.jspecas.com.br/sistemas/public/login';
        }

        return $this->redirect()->toUrl($redirectUrl);
    }

    public function indexAction()
    {
        $session = $this->plugin('SessionPlugin')->getSession();
        if(!$session){
            return $this->redirect()->toUrl('http://sistemas.jspecas.com.br/sistemas/public/login/index/getsession2?url=10.2.7.18/login');    
        }
        
        return new ViewModel();
    }
}
