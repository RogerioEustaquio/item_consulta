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
        // Simulação concluída
        view.down('#solicitacaosimulada').getStore().on('load', function(store, records, successful){
            var r = records[0],
                form = view.down('#formmarkup');

            form.down('[name=icms]').setValue(r.get('icms'));
            form.down('[name=pisCofins]').setValue(r.get('pisCofins'));
            form.down('[name=comissao]').setValue(r.get('comissao'));
            form.down('[name=custo]').setValue(r.get('custo'));
            form.down('[name=markup]').setValue(r.get('markup'));
            form.down('[name=preco]').setValue(r.get('npreco'));
            form.down('[name=mb]').setValue(r.get('nmb'));
            form.down('combobox[name=desconto]').select(r.get('ndescontoLetra'));
            form.down('[name=mbmin]').setValue(r.get('nmbMin'));
        });
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
