Ext.define('App.view.pvsolicitacao.AlteracaoGridPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.solicitacaoalteracao',

    control: {
        
    },

    init: function (view) {

        // Ouvinto do evento de nova solicitação
        App.app.on('solicitacaoalteracaoenviada', function(data = []){

            // Recarrega o grid
            view.getStore().load();
        });

    }
    
});
