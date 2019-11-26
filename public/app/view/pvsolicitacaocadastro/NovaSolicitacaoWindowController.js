Ext.define('App.view.pvsolicitacaocadastro.NovaSolicitacaoWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pvsolicitacaocadastronovasolicitacao',

    control: {
        
    },

    listen: {
        global: {
            appteste: function(btn){
                console.log('appteste 2')
                console.log(this.getView())
            }
        }
    },

    init: function (view) {
        
    },

    onBtnConfirmarClick: function(btn){
        var me = this,
            window = this.getView(),
            form = window.down('form').getForm(),
            values = form.getValues(),
            notyType = 'success',
            notyText = 'Solicitação enviada com sucesso!';

        window.setLoading({ msg: '<b>Salvando os dados...</b>' });

        Ext.Ajax.request({
            url: BASEURL +'/api/pvsolicitacaocadastro/enviarsolicitacao',
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
                
                form.reset();
                window.close();

                Ext.GlobalEvents.fireEvent('pvsolicitacaocadastrosolicitacaoenviada', values);
            }
        });

    }

});
