Ext.define('App.view.pvsolicitacao.AlteracaoGridPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pvsolicitacaoalteracao',

    control: {
        'pvsolicitacaoalteracaogridpanel': {
            select: 'onSelect'
        }
    },

    init: function (view) {

        // Ouvinto do evento de nova solicitação
        App.app.on('pvsolicitacaoalteracaoenviada', function(data = []){

            // Recarrega o grid
            view.getStore().load();
        });

    },

    onSelect: function(grid, selected){
        App.app.fireEvent('pvsolicitacaoalteracaoprecoselect', selected);
    }
    
});
