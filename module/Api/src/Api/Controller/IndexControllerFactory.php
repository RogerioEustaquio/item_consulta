<?php
namespace Api\Controller;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;
use Zend\Stdlib\DispatchableInterface;
use Zend\Stdlib\RequestInterface;
use Zend\Stdlib\ResponseInterface;

use Api\Controller\IndexController;
use Api\Entity\Pessoa;

class IndexControllerFactory implements FactoryInterface, DispatchableInterface
{
    public function dispatch(RequestInterface $request, ResponseInterface $response = null)
    {
        return new IndexController();
    }
    
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        echo '__invoke';
        echo $requestedName; exit;
        $pessoa = new Pessoa();
        return new IndexController($pessoa);
    }
}
