<?php
namespace Core\Stdlib;

class StdClass extends \stdClass
{
    /**
     * __set
     *
     */
    public function __set($property, $value)
    {
        $this->$property = $value;
    }
    
    /**
     * 
     * @param unknown $key
     * @param unknown $params
     */
    public function __call($key, $params)
    {
        $attribute = array();
        $properties = get_object_vars($this);
        
        $transform = function ($letters) {
        	$letter = substr(array_shift($letters), 1, 1);
        	return ucfirst($letter);
        };
        
        foreach($properties as $property => $value)
        {
            $method = lcfirst(preg_replace_callback('/_([a-z])/', $transform, $property));
            $method = 'get' . ucfirst($method);
            if($key == $method){
                return $this->$property; 
            }
        }
        
        throw new \Exception("Method $key not localized this class!");
        
        /*
         * Camelcase to underscore
         *  //$key = preg_replace('#([A-Z\d]+)([A-Z][a-z])#','\1_\2', $key);
         *  //$key = preg_replace('#([a-z\d])([A-Z])#', '\1_\2', $key);
         *  //$key = substr(strtolower($key), 4);
         *  //return $this->$key; 
         */
        
    }
}
