Ext.define('App.view.pvsolicitacaocadastro.Main', {
    extend: 'Ext.Container',
    xtype: 'pvsolicitacaocadastromain',
    requires: [
        'App.view.pvsolicitacaocadastro.SolicitacoesGridPanelController',
        'App.view.pvsolicitacaocadastro.NovaSolicitacaoWindow'
    ],

    // controller: 'pvsolicitacaocadastrosolicitacoes',
    
    title: 'Cadastro de Preço',

    layout: 'fit',
    items: [
        {
            xtype: 'pvsolicitacaocadastrogridpanel',
            title: null
        }
    ]
});