Ext.define('App.view.SolicitacaoCadastroGridPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'solicitacaocadastrogridpanel',

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