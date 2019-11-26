Ext.define('App.view.pvsolicitacao.Main', {
    extend: 'Ext.Container',
    xtype: 'pvsolicitacaoalteracaomain',
    requires: [
        'App.view.pvsolicitacao.AlteracaoGridPanel',
        'App.view.pvsolicitacao.AlteracaoWindow',
        'App.view.pvsolicitacao.AlteracaoComentariosGridPanel'
    ],
    
    title: 'Alteração de Preço',

    layout: 'fit',
    items: [
        {
            // title: 'Alteração de Preço',
            xtype: 'container',
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
        }
    ]
});