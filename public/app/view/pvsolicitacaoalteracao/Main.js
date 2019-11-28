Ext.define('App.view.pvsolicitacaoalteracao.Main', {
    extend: 'Ext.Container',
    xtype: 'pvsolicitacaoalteracaomain',

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
                    xtype: 'pvsolicitacaoalteracaosolicitacoesgridpanel',
                    title: null,
                    flex: 1
                },
                {
                    region: 'east',
                    xtype: 'tabpanel',
                    width: 320,
                    items: [
                        {
                            xtype: 'pvsolicitacaoalteracaosolicitacaocomentariosgridpanel'
                        }
                    ]
                }
            ]
        }
    ]
});