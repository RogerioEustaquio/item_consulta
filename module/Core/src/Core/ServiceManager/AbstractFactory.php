<?php
namespace Core\ServiceManager;

use Interop\Container\ContainerInterface; 
use Zend\ServiceManager\Factory\AbstractFactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
 
class AbstractFactory implements AbstractFactoryInterface
{
    public function canCreate(ContainerInterface $container, $requestedName)
    {
        $class = $this->getControllerName($requestedName);
        return class_exists($class);
    }

    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $class = $this->getControllerName($requestedName);
        return new $class();
    }
    
    protected function getControllerName($requestedName){
        return $requestedName."Controller";
    }
}