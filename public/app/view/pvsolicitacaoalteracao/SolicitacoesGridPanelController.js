Ext.define('App.view.pvsolicitacaoalteracao.SolicitacoesGridPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pvsolicitacaoalteracaoalteracoesgridpanel',

    control: {
        'pvsolicitacaoalteracaosolicitacoesgridpanel': {
            select: 'onSelect'
        }
    },

    listen: {
        global: {
            pvsolicitacaoalteracaosolicitacaoenviada: function(values){
                // Atualiza a grid de solicitações
                this.getView().getStore().reload()
            }
        }
    },

    init: function (view) {


    },

    // Item selecionado
    onSelect: function(grid, selected){
        var main = grid.view.up('pvsolicitacaoalteracaomain'),
            comentariosGriPanel = main.down('pvsolicitacaoalteracaosolicitacaocomentariosgridpanel');
        
        // // Recarrega o grid
        var store = comentariosGriPanel.getStore(),
            solicitacao = selected.get('idSolicitacao');
        
        store.proxy.extraParams.solicitacao = solicitacao;
        store.reload();
    },

    onBtnNovaSolicitacaoClick: function(btn){
        var comboEmpresa = btn.up('toolbar').down('combobox[name=empresa]');
        
        Ext.create('App.view.pvsolicitacaoalteracao.NovaSolicitacaoWindow',{
            empresa: comboEmpresa.getValue()
        }).show();
    }
    
});
