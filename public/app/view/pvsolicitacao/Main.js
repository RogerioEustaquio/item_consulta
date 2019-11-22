Ext.define('App.view.pvsolicitacao.Main', {
    extend: 'Ext.Container',
    xtype: 'pvsolicitacaomain',
    requires: [
        'App.view.pvsolicitacao.AlteracaoGridPanel',
        'App.view.pvsolicitacao.CadastroGridPanel',
        'App.view.pvsolicitacao.AlteracaoWindow',
        'App.view.pvsolicitacao.AlteracaoComentariosGridPanel'
    ],
    
    layout: 'fit',
    items: [
        {
            xtype: 'tabpanel',
            items: [
                {
                    title: 'Alteração de Preço',
                    // xtype: 'container',
                    layout: 'border',
                    items: [
                        {
                            region: 'center',
                            xtype: 'pvsolicitacaoalteracaogridpanel',
                            title: null,
                            flex: 1
                        },
                        {
                            region: 'east',
                            xtype: 'tabpanel',
                            width: 320,
                            items: [
                                {
                                    xtype: 'pvsolicitacaoalteracaocomentariosgridpanel'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Cadastro de Preço'
                }
                // {
                //     xtype: 'pvsolicitacaoalteracaogridpanel'
                // },
                // {
                //     xtype: 'pvsolicitacaocadastrogridpanel'
                // }
            ]
        }
    ]
});