<?php
 
namespace Core\Mvc\Controller\Plugin;
 
use Zend\Http\Request;
use Zend\Mvc\Controller\Plugin\AbstractPlugin;
 
class SessionPlugin extends AbstractPlugin {

    public function getSession() {
        session_start();
        $session = isset($_SESSION['info']) ? $_SESSION : null;

        // if(!$session){
        //     throw new \Exception("ORA:-20000 Usuário não logado no sistema!<br>Favor logar no Portal Agilize!");
        // }
        
        return $session;
    }

    public function setSession($session) {
        session_start();
        $_SESSION['info'] = $session->info;
        $_SESSION['recursos'] = $session->recursos;
        session_write_close();
        return $session;
    }

    public function getResources() {
        session_start();
        $session = isset($_SESSION['recursos']) ? $_SESSION : null;

        if(!$session){
            throw new \Exception("ORA:-20000 Usuário não logado no sistema!<br>Favor logar no Portal Agilize!");
        }

        if (!isset($session['recursos']['73']) && !isset($session['recursos']['74'])) {
            throw new \Exception("ORA:-20000 Usuário não permitido!");
        }
        
        $data = $session['info'];

        if (isset($session['recursos']['73'])) {
            $data['descricao'] = $session['recursos']['73']['descricao'];
            $data['idEmpresas'] = $session['recursos']['73']['idEmpresa'];
            $data['recurso'] = 73;
        } else {
            $data['descricao'] = $session['recursos']['74']['descricao'];
            $data['idEmpresas'] = $session['recursos']['74']['idEmpresa'];
            $data['recurso'] = 74;
        }

        return $data;
    }
 
}