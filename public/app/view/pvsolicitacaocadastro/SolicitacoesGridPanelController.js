Ext.define('App.view.pvsolicitacaocadastro.SolicitacoesGridPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pvsolicitacaocadastrosolicitacoes',

    control: {
        
    },

    listen: {
        global: {
            pvsolicitacaocadastrosolicitacaoenviada: function(values){
                this.getView().getStore().reload();
            }
        }
    },

    init: function (view) {
        
    },

    onBtnNovaSolicitacaoClick: function(btn){
        var comboEmpresa = btn.up('toolbar').down('#comboempresa');
        
        // console.log('ok')
        // Ext.GlobalEvents.fireEvent('appteste', btn)
        Ext.create('App.view.pvsolicitacaocadastro.NovaSolicitacaoWindow',{
            empresa: comboEmpresa.getValue()
        }).show();
    },

    onBtnAlterarSolicitacaoClick: function(btn){
        console.log('onBtnAlterarSolicitacaoClick')
    },

    onEmpresaSelect: function( combo, record ){
        var value = combo.getValue(),
            btnNovaSolicitacao = combo.up('toolbar').down('#novasolicitacao');

        // // Ativa o botao de nova solicitacao
        btnNovaSolicitacao.enable();

        // // Não ativa para o ec
        if(value === 'EC')
        btnNovaSolicitacao.disable();

        // // Filtra os itens da filial
        var grid = combo.up('grid'),
            store = grid.getStore();

        // Atualiza
        store.proxy.extraParams.emp = combo.getValue();
        store.reload();
    }
    
});
