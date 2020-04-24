<?php
namespace Core\Hydrator\Strategy;
use Zend\Hydrator\Strategy\StrategyInterface;

class ValueStrategy implements StrategyInterface
{
    public static function toValue($value){
        return str_replace(",", ".", $value);
    }

    public function extract($value)
    {
    	return str_replace(",", ".", $value);
    }
    
    /**
     * {@inheritdoc}
     *
     * Convert a string value into a DateTime object
     */
    public function hydrate($value)
    {
    	return $value;
    }
}
