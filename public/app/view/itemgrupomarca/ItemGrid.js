Ext.define('App.view.itemgrupomarca.ItemGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'ItemGrid',
    store: 'Companies',
    columnLines: true,
    selType: 'checkboxmodel',
    margin: '1 1 1 1',
    store: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model', {
                // fields: ['descricao', 'marca','estoque']
                fields:[{name:'emp',mapping:'emp'},
                        {name:'grupoMarca',mapping:'grupoMarca'},
                        {name:'marca',mapping:'marca'},
                        {name:'CodItem',mapping:'CodItem'},
                        {name:'descricao',mapping:'descricao'},
                        {name:'ultimaCompra',mapping:'ultimaCompra'},
                        {name:'ultimaVenda',mapping:'ultimaVenda'},
                        {name:'estoque',mapping:'estoque'}
                        ]
        }),
        proxy: {
            type: 'ajax',
            method:'POST',
            url : BASEURL + '/api/itemgrupomarca/listaritem',
            encode: true,
            // extraParams: {param1: '0',  param2: ''},
            format: 'json',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        },
        autoLoad : true
    }),
    columns: [
        {
            text: 'Emp',
            dataIndex: 'emp',
            width: 52
        },
        {
            text: 'Grupo',
            dataIndex: 'grupoMarca',
            width: 120
            
        },
        {
            text: 'Marca',
            dataIndex: 'marca',
            width: 100
        },
        {
            text: 'Código',
            dataIndex: 'codItem',
            width: 100
        },
        {
            text: 'Descrição',
            dataIndex: 'descricao',
            flex: 1
        },
        {
            text: 'Ult. Compra',
            dataIndex: 'ultimaCompra',
            width: 95
        },
        {
            text: 'Ult. Venda',
            dataIndex: 'ultimaVenda',
            width: 84
        },
        {
            text: 'Estoque',
            dataIndex: 'estoque',
            width: 74
        }
    ]

});