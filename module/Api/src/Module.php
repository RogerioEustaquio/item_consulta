<?php
namespace Api;
use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\ServiceManager\Factory\InvokableFactory;
use Core\ServiceManager\AbstractFactory;

class Module
{

    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/' . __NAMESPACE__,
                ),
            ),
        );
    }
    
    public function getServiceConfig()
    {
        return [
            'factories' => [
                __NAMESPACE__ . '\Service\ClienteService' => Service\ClienteServiceFactory::class,
            ],
			'invokables' => array(
                'ExcelService' => 'Api\Service\ExcelService',
            ),
        ];
    }
    
    public function getControllerConfig()
    {
        $config = array();
        
        //
        $config['invokables'] = array();
        
        // Configura a fábrica abstrata
        $config['abstract_factories'] = array(
            AbstractFactory::class
        );
        
        // Configura os controles
        $config['factories'] = array();
        
        // Busca os arquivos de controle
        $controllers = $this->getControllerFiles();
        
        // Percorre os controllers
        foreach($controllers as $controllerName => $controllerClass){
            $idx = __NAMESPACE__ . '\\' . 'Controller' . '\\' .$controllerName;
            $class = __NAMESPACE__ . '\\' . 'Controller' . '\\' . $controllerClass;
            
            // Se a classe existir adiciona ela
            if(class_exists($class)){
                $config['factories'][$idx] =  $class;
            }
        }
        
        return $config;
    }

    public function onBootstrap(MvcEvent $e)
    {

        // $isDevMode = true;
        // $config = \Doctrine\ORM\Tools\Setup::createAnnotationMetadataConfiguration(array(), $isDevMode);
        // // database configuration parameters
        // $conn = array(
        //     'driver' => 'pdo_sqlite',
        //     'path' => './data/db.sqlite',
        // );

        // // obtaining the entity manager
        // $entityManager = \Doctrine\ORM\EntityManager::create($conn, $config);
        // $product = $entityManager->find('Api\Entity\Pessoa', 1);

        // $teste = New Entity\Pessoa();

        $eventManager = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);
    }

    /**
     * Busca os arquivos de controle
     * @return array
     */
    protected function getControllerFiles(){
        // Define o diretório dos controllers
        $controllerDir = __DIR__ . '/' . __NAMESPACE__ . '/' . 'Controller';
        
        // Busca os arquivos da pasta de controllers
        $files = scandir($controllerDir);
        
        $controllers = array();
        
        // Percorre os controllers
        foreach($files as $file) {
            // Se for um controller
            if(strpos($file, 'Controller.php') > 0){
               $idx = str_replace("Controller.php", "", $file);
               $controllerName = str_replace(".php", "", $file);
               $controllers[$idx] = $controllerName;
            }
        }
        
        return $controllers;
    }    
}
