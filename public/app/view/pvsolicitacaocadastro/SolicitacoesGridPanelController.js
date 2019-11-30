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

    onSelect: function(grid, selected){
        
    },

    onBtnNovaSolicitacaoClick: function(btn){
        var comboEmpresa = btn.up('toolbar').down('#comboempresa');
        
        // console.log('ok')
        // Ext.GlobalEvents.fireEvent('appteste', btn)
        Ext.create('App.view.pvsolicitacaocadastro.NovaSolicitacaoWindow',{
            empresa: comboEmpresa.getValue()
        }).show();
    },

    onBtnConcluirClick: function(btn){
        var me = this,
            grid = me.getView(),
            store = grid.getStore();
            selection = grid.getSelection(),
            row = selection[0];
            idSolicitacao = row.get('idSolicitacao')
            notyType = 'success',
            notyText = 'Solicitação concluída com sucesso!';
            params = { idSolicitacao: idSolicitacao };
            
            grid.setLoading({msg: '<b>Salvando os dados...</b>'});
        
        Ext.Ajax.request({
            url: BASEURL +'/api/pvsolicitacaocadastro/concluirsolicitacao',
            method: 'POST',
            params: params,
            success: function (response) {
                var result = Ext.decode(response.responseText);

                if(!result.success){
                    notyType = 'error';
                    notyText = result.message;
                }

                me.noty(notyType, notyText);

                if(result.success){
                    // Evento de envio
                    store.load();
                }

                grid.setLoading(false);
            }
        });

        
    },

    onBtnCancelarClick: function(btn){
        var me = this,
            grid = me.getView(),
            store = grid.getStore();
            selection = grid.getSelection(),
            row = selection[0];
            idSolicitacao = row.get('idSolicitacao')
            notyType = 'success',
            notyText = 'Solicitação cancelada com sucesso!';
            params = { idSolicitacao: idSolicitacao };
            
            grid.setLoading({msg: '<b>Salvando os dados...</b>'});
        
        Ext.Ajax.request({
            url: BASEURL +'/api/pvsolicitacaocadastro/cancelarsolicitacao',
            method: 'POST',
            params: params,
            success: function (response) {
                var result = Ext.decode(response.responseText);

                if(!result.success){
                    notyType = 'error';
                    notyText = result.message;
                }

                me.noty(notyType, notyText);

                if(result.success){
                    // Evento de envio
                    store.load();
                }

                grid.setLoading(false);
            }
        });

        
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
