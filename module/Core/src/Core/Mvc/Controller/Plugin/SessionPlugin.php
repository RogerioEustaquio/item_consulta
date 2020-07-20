<?php
 
namespace Core\Mvc\Controller\Plugin;
 
use Zend\Http\Request;
use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use stdClass;
 
class SessionPlugin extends AbstractPlugin {

    public function getSession() {

        if(session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }

        $session = isset($_SESSION['info']) ? $_SESSION : null;

        if(!$session){
            // throw new \Exception("ORA:-20000 Usuário não logado no sistema!<br>Favor logar no Portal Agilize!");
            $session = null;
        }
        
        return $session;
    }

    public function setSession($session) {

        if(session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }
        $_SESSION['info'] = $session;
        session_write_close();
        return $session;
    }

    public function getResources() {
        
        if(session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }
        $session = isset($_SESSION['info']) ? $_SESSION : null;

        if(!$session){
            throw new \Exception("ORA:-20000 Usuário não logado no sistema!<br>Favor logar no Portal Agilize!");
        }
        
        return $session['info'];
    }
 
}