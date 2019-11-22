Ext.Loader.setConfig({enabled: true, disableCaching: true});

Ext.application({
    name: 'App',
    appFolder: 'app',

    requires: [
        'App.view.Viewport'
    ],
    
    controllers: [
        'ApplicationController',
    ],
    
    mainView: 'App.view.Viewport',

    defaultToken: 'solicitacao',
    
    launch: function() {
        
    }

});