<?php
 
namespace Core\Mvc\Controller\Plugin;
 
use Zend\Http\Request;
use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use stdClass;
 
class SessionPlugin extends AbstractPlugin {

    public function getSession() {
        session_start();
        $session = isset($_SESSION['info']) ? $_SESSION : null;

        if(!$session){
            throw new \Exception("ORA:-20000 Usuário não logado no sistema!<br>Favor logar no Portal Agilize!");
        }
        
        return $session;
    }

    public function setSession($session) {
        session_start();
        $_SESSION['info'] = $session;
        session_write_close();
        return $session;
    }

    public function getResources() {
        session_start();
        $session = isset($_SESSION['info']) ? $_SESSION : null;

        if(!$session){
            throw new \Exception("ORA:-20000 Usuário não logado no sistema!<br>Favor logar no Portal Agilize!");
        }
        
        return $session['info'];
    }
 
}