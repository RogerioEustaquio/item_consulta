Ext.define('App.view.pvtransfproduto.Main', {
    extend: 'Ext.Container',
    xtype: 'pvtransfprodutomain',
    id: 'transfprodutomain',
    itemId: 'transfprodutomain',
    requires: [

    ],
    title: 'Simular Transf. Produto',
    layout: 'border',
    items: {
        region: 'center',
        xtype: 'tabpanel',
        layout: 'fit',
        items: [
            {
                title: 'Simulador',
                xtype: 'pvtransfprodutogridpanel',
                
            },
            {
                xtype: 'transfprodutopedidopanel',
                title: 'Solicitações'

            }
        ]
    }
});