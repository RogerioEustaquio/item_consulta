<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Api;

use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;
use Zend\ServiceManager\Factory\InvokableFactory;

return [
    'doctrine' => array(
        'driver' => array(
            __NAMESPACE__ . '_driver' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(__DIR__ . '/../src/' . __NAMESPACE__ . '/Entity')
            ),
            'orm_default' => array(
                'drivers' => array(
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver'
                ),
            ),
        ),
    ),
    'router' => [
        'routes' => [
            'api-home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/api',
                    'defaults' => [
                        '__NAMESPACE__' => 'Api\Controller',
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => array(
                    'default' => array(
                        'type'    => Segment::class,
                        'options' => array(
                            'route'    => '/[:controller[/:action]]',
                            'constraints' => array(
                                '__NAMESPACE__' => 'Api\Controller',
//                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
//                                'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                            ),
                            'defaults' => array('action' => null) 
                        ),
                    ),
                ),
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            Controller\IndexController::class => InvokableFactory::class,
        ],
    ],
    'view_manager' => [
        'strategies' => array(
            'ViewJsonStrategy',
        ),
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'layout/layout'        => __DIR__ . '/../view/layout/layout.phtml',
            'api/index/index'      => __DIR__ . '/../view/api/index/index.phtml',
            'error/404'            => __DIR__ . '/../view/error/404.phtml',
            'error/index'          => __DIR__ . '/../view/error/index.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
    ],
];
