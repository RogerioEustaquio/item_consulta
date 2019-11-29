Ext.define('App.view.pvsolicitacaoalteracao.AnaliseWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pvsolicitacaoalteracaoanalisewindow',

    control: {
        
    },

    listen: {
        global: {
            
        }
    },

    init: function (view) {
        
    },

    onBtnSimularClick: function(btn){
        var me = this,
            gridSolicitacaoSimulada = me.getView().down('#solicitacaosimulada'),
            form = me.getView().down('#formmarkup'),
            preco = form.down('numberfield[name=preco]').getValue(),
            comboDesconto = me.getView().down('combobox[name=desconto]'),
            comboDescontoSelection = comboDesconto.getSelection(),
            idDescontoLetra = comboDescontoSelection.get('idDescontoLetra'),
            descontoValor = comboDescontoSelection.get('valor');

            gridSolicitacaoSimulada.getStore().proxy.extraParams.preco = preco;
            gridSolicitacaoSimulada.getStore().proxy.extraParams.descontoLetra = idDescontoLetra;
            gridSolicitacaoSimulada.getStore().proxy.extraParams.descontoPerc = descontoValor;
            gridSolicitacaoSimulada.getStore().load();

    }

});
