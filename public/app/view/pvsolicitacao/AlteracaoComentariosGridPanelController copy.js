Ext.define('App.view.pvsolicitacao.AlteracaoComentariosGridPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pvsolicitacaoalteracaocomentarios',


     
    listen : {
        //listen to events using GlobalEvents
        global: {
            'pvsolicitacaoalteracaoprecoselect' : 'onSolicitacaoSelect'
        }
    },

    onSolicitacaoSelect: function(data = []){
        var me = this;
        
        console.log(me.getView())
    },

    control: {
        'pvsolicitacaoalteracaocomentariosgridpanel': {
            render: 'onViewRender'
        }
    },

    init: function (view) {
        console.log('init')
    },

    onViewRender: function(view){
        var me = this;
        me.view = view;

        console.log('on view')

        // Ouvinto do evento de solicitação de alteração de preço selecionada
        // App.app.on('pvsolicitacaoalteracaoprecoselect', function(data = []){

            // console.log( me.view )

            // // Recarrega o grid
            // var store = me.getView().getStore(),
            //     solicitacao = data.get('idSolicitacao');
            
            // store.proxy.extraParams.solicitacao = solicitacao;
            // store.reload();
        // });
    },
    
});
