Ext.define('App.view.SolicitacaoMain', {
    extend: 'Ext.Container',
    xtype: 'solicitacaomain',
    requires: [
        'App.view.SolicitacaoAlteracaoGridPanel',
        'App.view.SolicitacaoCadastroGridPanel',
        'App.view.SolicitacaoAlteracaoWindow'
    ],
    
    layout: 'fit',
    items: [
        {
            xtype: 'tabpanel',
            items: [
                {
                    xtype: 'solicitacaoalteracaogridpanel'
                },
                {
                    xtype: 'solicitacaocadastrogridpanel'
                }
            ]
        }
    ]
});