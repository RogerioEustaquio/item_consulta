<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application;

use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;
use Zend\ServiceManager\Factory\InvokableFactory;

return [
    'controllers' => [
        'factories' => [
            Controller\IndexController::class => InvokableFactory::class,
            Controller\PrecificacaoController::class => InvokableFactory::class,
            Controller\PerformanceController::class => InvokableFactory::class,
            View\Helper\Navigation::class => InvokableFactory::class,
        ],
    ],
    
    'router' => [
        'routes' => [

            'home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action' => 'index',
                    ],
                ]
            ],

            'app-login' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/login',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action' => 'login',
                    ],
                ]
            ],

            'app-pricing' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/precificacao[/:action]',
                    'constraints' => array(
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*'
                    ),
                    'defaults' => [
                        'controller' => Controller\PrecificacaoController::class,
                        'action' => 'index',
                    ],
                ],
            ],

            'app-performance' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/performance[/:action]',
                    'constraints' => array(
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*'
                    ),
                    'defaults' => [
                        'controller' => Controller\PerformanceController::class,
                        'action' => 'index',
                    ],
                ],
            ]
            
        ],
    ],

    'view_helpers' => array(
        'invokables' => array(
            'nav' => View\Helper\Navigation::class,
        ),
    ),
    
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'layout/layout' => __DIR__ . '/../view/layout/layout.phtml',
            'navigation' => __DIR__ . '/../view/layout/components/navigation.phtml',
            
            'admin-navigation' => __DIR__ . '/../view/layout/components/admin-navigation.phtml',
            
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404' => __DIR__ . '/../view/error/404.phtml',
            'error/index' => __DIR__ . '/../view/error/index.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
    ],
];
