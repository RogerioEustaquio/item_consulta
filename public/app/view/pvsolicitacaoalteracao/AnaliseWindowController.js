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
            form.down('[name=markup]').setValue(r.get('nmarkup'));
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

            // Verifica se tem comentário e está pendente
            if(comentarioInserido && solicitacao.get('idSolicitacaoStatus') === 1)
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
        var me = this,
            notyType = 'success',
            notyText = 'Solicitação aprovada com sucesso!',
            window = this.getView(),
            grid = window.down('#solicitacaosimulada'),
            store = grid.getStore(),
            record = store.getData().items[0];
            
        var params = {
            solicitacao: window.solicitacao.get('idSolicitacao'),
            // emp: record.get('emp'),
            // codigo: record.get('codigo'),
            markup: record.get('nmarkup'),
            preco: record.get('npreco'),
            margem: record.get('nmb'),
            // descontoLetra: record.get('ndescontoLetra'),
            comentario: window.down('#formmarkup').down('[name=comentario]').getValue()
        };
            
        window.setLoading({msg: '<b>Salvando os dados...</b>'});

        Ext.Ajax.request({
            url: BASEURL +'/api/pvsolicitacaoalteracao/aprovarsolicitacao',
            method: 'POST',
            params: params,
            success: function (response) {
                var result = Ext.decode(response.responseText);

                if(!result.success){
                    notyType = 'error';
                    notyText = result.message;
                    window.setLoading(false);
                }

                me.noty(notyType, notyText);

                if(result.success){
                    me.getView().close();

                    // Evento de envio
                    Ext.GlobalEvents.fireEvent('pvsolicitacaoalteracaoconcluida', params);
                }
            }
        });
    },

    onBtnAlterarClick: function(btn){
        var me = this,
            notyType = 'success',
            notyText = 'Solicitação alterada com sucesso!',
            window = this.getView(),
            grid = window.down('#solicitacaosimulada'),
            store = grid.getStore(),
            record = store.getData().items[0];
            
        var params = {
            solicitacao: window.solicitacao.get('idSolicitacao'),
            emp: record.get('emp'),
            codigo: record.get('codigo'),
            markup: record.get('nmarkup'),
            preco: record.get('npreco'),
            margem: record.get('nmb'),
            descontoLetra: record.get('ndescontoLetra'),
            comentario: window.down('#formmarkup').down('[name=comentario]').getValue()
        };
            
        window.setLoading({msg: '<b>Salvando os dados...</b>'});

        Ext.Ajax.request({
            url: BASEURL +'/api/pvsolicitacaoalteracao/alterarsolicitacao',
            method: 'POST',
            params: params,
            success: function (response) {
                var result = Ext.decode(response.responseText);

                if(!result.success){
                    notyType = 'error';
                    notyText = result.message;
                    window.setLoading(false);
                }

                me.noty(notyType, notyText);

                if(result.success){
                    me.getView().close();

                    // Evento de envio
                    Ext.GlobalEvents.fireEvent('pvsolicitacaoalteracaoconcluida', params);
                }
            }
        });
    },

    onBtnReprovarClick: function(btn){
        var me = this;

        var me = this,
            notyType = 'success',
            notyText = 'Solicitação reprovada com sucesso!',
            window = this.getView(),
            grid = window.down('#solicitacaosimulada'),
            store = grid.getStore(),
            record = store.getData().items[0];
            
        var params = {
            solicitacao: window.solicitacao.get('idSolicitacao'),
            comentario: window.down('#formmarkup').down('[name=comentario]').getValue()
        };
            
        window.setLoading({msg: '<b>Salvando os dados...</b>'});

        Ext.Ajax.request({
            url: BASEURL +'/api/pvsolicitacaoalteracao/reprovarsolicitacao',
            method: 'POST',
            params: params,
            success: function (response) {
                var result = Ext.decode(response.responseText);

                if(!result.success){
                    notyType = 'error';
                    notyText = result.message;
                    window.setLoading(false);
                }

                me.noty(notyType, notyText);

                if(result.success){
                    me.getView().close();

                    // Evento de envio
                    Ext.GlobalEvents.fireEvent('pvsolicitacaoalteracaoconcluida', params);
                }
            }
        });
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
    },

    noty: function(notyType, notyText){
        new Noty({
            theme: 'relax',
            layout: 'bottomRight',
            type: notyType,
            timeout: 3000,
            text: notyText
        }).show();
    }
});
