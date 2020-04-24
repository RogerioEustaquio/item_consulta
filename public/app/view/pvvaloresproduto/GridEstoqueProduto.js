Ext.define('App.view.pvvaloresproduto.GridEstoqueProduto', {
    extend: 'Ext.grid.Panel',
    xtype: 'gridestoqueproduto',
    store: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model', {
                // fields: ['descricao', 'marca','estoque']
                fields:[{name:'emp',mapping:'emp'},
                        {name:'estoque',mapping:'estoque'}
                        ]
        }),
        proxy: {
            type: 'ajax',
            method:'POST',
            url : BASEURL + '/api/precosugerido/listarprodutoestoque',
            encode: true,
            // extraParams: {param1: '0',  param2: ''},
            format: 'json',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }),
    columns: [
        {
            text: 'Emp',
            dataIndex: 'emp',
            width: 52
        },
        {
            text: 'Estoque',
            dataIndex: 'estoque',
            flex: 1
        }
    ]

});