<?php
namespace Core\Hydrator;

class ObjectProperty extends \Zend\Hydrator\ObjectProperty
{
    /**
     * Hydrate an object by populating public properties
     *
     * Hydrates an object by setting public properties of the object.
     *
     * @param  array $data
     * @param  object $object
     * @return object
     * @throws Exception\BadMethodCallException for a non-object $object
     */
    public function hydrate(array $data, $object)
    {
    	return parent::hydrate(array_change_key_case($data, CASE_LOWER), $object);
    }
    
    /**
     * Extract values from an object
     *
     * Extracts the accessible non-static properties of the given $object.
     *
     * @param  object $object
     * @return array
     * @throws Exception\BadMethodCallException for a non-object $object
     */
    public function extract($object, $underscoreSeparatedKeys = false)
    {
        $data = parent::extract($object);
        
        if(!$underscoreSeparatedKeys) {
            $transform = function ($letters) {
            	$letter = substr(array_shift($letters), 1, 1);
            	return ucfirst($letter);
            };
            
            foreach ($data as $property => $value) {
                unset($data[$property]);
                $property = lcfirst(preg_replace_callback('/_([a-z])/', $transform, $property));
                $data[$property] = $value;
            }
        }
        
    	return $data;
    }
    
}
