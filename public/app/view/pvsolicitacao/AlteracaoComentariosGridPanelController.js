Ext.define('App.view.pvsolicitacao.AlteracaoComentariosGridPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pvsolicitacaoalteracaocomentarios',

    control: {
        
    },

    init: function (view) {
        // Ouvinto do evento de solicitação de alteração de preço selecionada
        App.app.on('pvsolicitacaoalteracaoprecoselect', function(data = []){
            // Recarrega o grid
            var store = view.getStore(),
                solicitacao = data.get('idSolicitacao');
            
            store.proxy.extraParams.solicitacao = solicitacao;
            store.reload();
        });
    }
    
});
