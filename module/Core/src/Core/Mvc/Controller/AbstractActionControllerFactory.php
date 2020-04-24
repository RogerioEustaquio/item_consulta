<?php
namespace Api\Controller;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;
use Api\Service\ClienteService;

class ClienteControllerFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        return new ClienteController($container->get('Api\Service\ClienteService'));
    }
}
