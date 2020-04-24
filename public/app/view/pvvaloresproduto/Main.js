Ext.define('App.view.pvvaloresproduto.Main', {
    extend: 'Ext.Container',
    xtype: 'pvvaloresprodutomain',
    id: 'valoresprodutomain',
    itemId: 'valoresprodutomain',
    requires: [

    ],
    title: 'Consulta Item',
    layout: 'border',
    items: [
        { 
            region: 'center',
            xtype: 'pvvaloresprodutogridpanel',
            title: null,
            flex: 1
        },
        {
            xtype: 'tabpanel',
            id:'tabdetalhe',
            itemId: 'tabdetalhe',
            layout: 'fit',
            title: 'Detalhes',
            region:'east',
            collapsible: true,
            collapsed: true,
            floatable: true,
            margin: '0 0 0 0',
            width: 300,
            items:[
                {
                    xtype: 'gridestoqueproduto',
                    title:'Estoque'
                }
            ]
        }
    ]
});