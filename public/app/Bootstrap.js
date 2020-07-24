Ext.Loader.setConfig({enabled: true, disableCaching: true});

Ext.application({
    name: 'App',
    appFolder: 'app',

    paths: {
        'Ext.ux': 'app/ux'
    },

    requires: [
        'Ext.ux.util.Format',
        'App.view.Viewport',
        'App.controller.PvValoresProdutoController',
        'App.controller.PvTransfProdutoController',
        'App.controller.ItemGrupoMarcaController'
    ],
    
    controllers: [
        'ApplicationController',
        'PvValoresProdutoController',
        'PvTransfProdutoController',
        'ItemGrupoMarcaController'
    ],
    
    mainView: 'App.view.Viewport',

    defaultToken: 'home',
    
    launch: function() {

        // var body = Ext.getBody();

        // Ext.create('Ext.panel.Panel', {
        //     id: 'panelSair',
        //     floating: true,
        //     layout: 'fit',
        //     width: '100%',
        //     items:[{
        //             xtype: 'button',
        //             iconCls: 'fa fa-sign-out-alt blue-text',
        //             tooltip: 'Logout',
        //             style: {
        //                 background: '#ffffff !important',
        //                 position: 'fixed !important',
        //                 top: '2px !important',
        //                 right: '2px !important'
        //             },
        //             renderTo: body
                
        //         }
        //     ]
            
        // });

        if(!USUARIO && USUARIO != '""')
        window.location.href = BASEURL + '/login';

        // Recupera os dados do usuário
        USUARIO = Ext.decode(USUARIO);

        // console.log(USUARIO);
    }

});