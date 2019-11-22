Ext.define('App.view.pvsolicitacao.Main', {
    extend: 'Ext.Container',
    xtype: 'pvsolicitacaomain',
    requires: [
        'App.view.pvsolicitacao.AlteracaoGridPanel',
        'App.view.pvsolicitacao.CadastroGridPanel',
        'App.view.pvsolicitacao.AlteracaoWindow'
    ],
    
    layout: 'fit',
    items: [
        {
            xtype: 'tabpanel',
            items: [
                {
                    xtype: 'pvsolicitacaoalteracaogridpanel'
                },
                {
                    xtype: 'pvsolicitacaocadastrogridpanel'
                }
            ]
        }
    ]
});