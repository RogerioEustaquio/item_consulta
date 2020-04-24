<?php
namespace Application\View\Helper;

use Zend\View\Helper\AbstractHelper;

class Usuario extends AbstractHelper
{
    public function __invoke()
    {
        session_start();
        $session = isset($_SESSION['info']) ? $_SESSION : null;

        if(!$session){
            // throw new \Exception("ORA:-20000 Usuário não logado no sistema!<br>Favor logar no Portal Agilize!");
            $usuario = null;
        } else {
            $usuario = json_encode($session['info']);
        }

        return $usuario;
    }
}