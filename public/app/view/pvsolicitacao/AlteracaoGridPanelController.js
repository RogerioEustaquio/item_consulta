Ext.define('App.view.pvsolicitacao.AlteracaoGridPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pvsolicitacaoalteracao',

    control: {
        'pvsolicitacaoalteracaogridpanel': {
            select: 'onSelect'
        }
    },

    init: function (view) {

        // // Ouvinto do evento de nova solicitação
        // App.app.on('pvsolicitacaoalteracaoenviada', function(data = []){

        //     // Recarrega o grid
        //     view.getStore().load();
        // });

    },

    // Item selecionado
    onSelect: function(grid, selected){
        var main = grid.view.up('pvsolicitacaoalteracaomain'),
            comentariosGriPanel = main.down('pvsolicitacaoalteracaocomentariosgridpanel');

        // // Recarrega o grid
        var store = comentariosGriPanel.getStore(),
            solicitacao = selected.get('idSolicitacao');
        
        store.proxy.extraParams.solicitacao = solicitacao;
        store.reload();
    }
    
});
