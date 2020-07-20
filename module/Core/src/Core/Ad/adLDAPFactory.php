<?php

namespace Core\Ad;

class adLDAPFactory{

    private $adLDAP;

    public function __construct(){
        require 'adLDAP/src/adLDAP.php';
        $this->adLDAP = new \adLDAP();
    }

    /**
     * @return type Description
     */
    public function getAdLDAP() {
        return $this->adLDAP;
    }

    public function getUser($idPessoa) {
        return $this->adLDAP->user()->find(false, 'description', $idPessoa);
    }

    public function getInfo($user) {

        return $this->adLDAP->user()->info($user, array('*'));
    }

    public function getInfoCollection($user) {
        return $this->adLDAP->user()->infoCollection($user, array('*'));
    }

    public function authenticate($user, $pass) {
        return $this->adLDAP->authenticate($user, $pass, true);
    }

    public function alterPassword($user, $pass) {
        return $this->adLDAP->user()->password($user, $pass);
    }

}