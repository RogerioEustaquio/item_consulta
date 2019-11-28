Ext.define('App.view.pvsolicitacaoalteracao.NovaSolicitacaoWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pvsolicitacaoalteracaonovasolicitacaowindow',

    control: {
        
    },

    listen: {
        global: {
            
        }
    },

    init: function (view) {
        
    },

    onBtnConfirmarClick: function(btn){
        var me = this,
            window = this.getView(),
            form = window.down('form'),
            notyType = 'success',
            notyText = 'Solicitação enviada com sucesso!',
            values = form.getForm().getValues();
            
        window.setLoading({msg: '<b>Salvando os dados...</b>'});

        Ext.Ajax.request({
            url: BASEURL +'/api/pvsolicitacao/enviarsolicitacao',
            method: 'POST',
            params: values,
            success: function (response) {
                var result = Ext.decode(response.responseText);

                if(!result.success){
                    notyType = 'error';
                    notyText = result.message;
                }

                new Noty({
                    theme: 'relax',
                    layout: 'bottomRight',
                    type: notyType,
                    timeout: 3000,
                    text: notyText
                }).show();

                form.getForm().reset();
                window.close();

                // Evento de envio
                Ext.GlobalEvents.fireEvent('pvsolicitacaoalteracaosolicitacaoenviada', values);
            }
        });
    }

});
