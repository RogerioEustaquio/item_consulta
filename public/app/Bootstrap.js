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
        'App.controller.PvSolicitacaoCadastroController'
    ],
    
    controllers: [
        'ApplicationController',
        'PvSolicitacaoCadastroController'
    ],
    
    mainView: 'App.view.Viewport',

    defaultToken: 'solicitacao',
    
    launch: function() {
        
    }

});