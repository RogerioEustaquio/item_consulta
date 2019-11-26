Ext.define('App.view.pvsolicitacao.CadastroGridPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'pvsolicitacaocadastrogridpanel',

    title: 'Cadastro de Preço',

    tbar: {
        items: [
            { 
                tooltip: 'Nova Solicitação',
                iconCls: 'fa fa-plus',
                handler: function(btn){
                    
                }
            },
            { 
                tooltip: 'Alterar Solicitação',
                iconCls: 'fa fa-pencil-alt',
                handler: function(btn){
                    
                }
            }
        ]
    }
});