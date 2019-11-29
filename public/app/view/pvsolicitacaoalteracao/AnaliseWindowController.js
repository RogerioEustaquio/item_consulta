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
            var solicitacao = view.solicitacao,
                r = records[0],
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

            // Valida e ativa os botões
            form.down('button[action=alterar]').disable();
            form.down('button[action=aprovar]').disable();
            form.down('button[action=reprovar]').disable();

            var comentarioInserido = false,
                fieldComentario = form.down('[name=comentario]').getValue();

            if(fieldComentario.length > 0)
            comentarioInserido = true;
            
            // Aprovar se o preço for igual o da solicitação
            if(solicitacao.get('precoPara') === r.get('npreco'))
                form.down('button[action=aprovar]').enable();

            // Alterar de o preço for diferente da solicitação
            if(solicitacao.get('precoPara') !== r.get('npreco')){
                // Verifica se tem comentário                
                if(comentarioInserido)
                form.down('button[action=alterar]').enable();
            }

            // Verifica se tem comentário                
            if(comentarioInserido)
            form.down('button[action=reprovar]').enable();

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

    },

    onBtnAprovarClick: function(btn){
        var me = this;
        
    },

    onBtnAlterarClick: function(btn){
        var me = this;

    },

    onBtnReprovarClick: function(btn){
        var me = this;

    },

    onBtnResetarClick: function(btn){
        var me = this,
            view = me.getView(),
            solicitacao = view.solicitacao,
            gridSolicitacaoSimulada = view.down('#solicitacaosimulada'),
            store = gridSolicitacaoSimulada.getStore();

            store.proxy.extraParams.emp = solicitacao.get('emp');
            store.proxy.extraParams.produto = solicitacao.get('codigo');
            store.proxy.extraParams.preco = solicitacao.get('precoPara');
            store.proxy.extraParams.descontoLetra = null;
            store.proxy.extraParams.descontoPerc = null;
            store.load();
    }
});
