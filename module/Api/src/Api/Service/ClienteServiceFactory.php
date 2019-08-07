<?php
namespace Api\Service;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class ClienteServiceFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $entityManager = $container->get('Doctrine\ORM\EntityManager');
        return new ClienteService($entityManager);
    }
}
