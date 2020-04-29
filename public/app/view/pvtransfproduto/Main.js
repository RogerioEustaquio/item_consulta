Ext.define('App.view.pvtransfproduto.Main', {
    extend: 'Ext.Container',
    xtype: 'pvtransfprodutomain',
    id: 'transfprodutomain',
    itemId: 'transfprodutomain',
    requires: [

    ],
    title: 'Simula Transf. Produto',
    layout: 'border',
    items: [
        {
            region: 'center',
            xtype: 'pvtransfprodutogridpanel',
            title: null,
            flex: 1
        }
    ]
});