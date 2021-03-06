Ext.define('App.view.itemgrupomarca.ItemGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'ItemGrid',
    store: 'Companies',
    columnLines: true,
    selType: 'checkboxmodel',
    margin: '1 1 1 1',
    requires: [
        'Ext.toolbar.Paging'
    ],
    
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
        displayMsg: 'Exibindo solicitações {0} - {1} de {2}',
        emptyMsg: "Não há solicitações a serem exibidos"
    },
    store: Ext.create('Ext.data.Store', {
                model: Ext.create('Ext.data.Model', {
                            fields:[{name:'emp',mapping:'emp'},
                                    {name:'grupoMarca',mapping:'grupoMarca'},
                                    {name:'marca',mapping:'marca'},
                                    {name:'CodItem',mapping:'CodItem'},
                                    {name:'descricao',mapping:'descricao'},
                                    {name:'idCurvaAbc',mapping:'idCurvaAbc'},
                                    {name:'ultimaCompra',mapping:'ultimaCompra'},
                                    {name:'ultimaVenda',mapping:'ultimaVenda'},
                                    {name:'estoque',mapping:'estoque'}
                                    ]
                }),
                pageSize: 50,
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    method:'POST',
                    url : BASEURL + '/api/itemgrupomarca/listaritem',
                    encode: true,
                    timeout: 60000,
                    format: 'json',
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        totalProperty: 'total'
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
            width: 110
        },
        {
            text: 'Descrição',
            dataIndex: 'descricao',
            flex: 1
        },
        {
            text: 'Curva',
            dataIndex: 'idCurvaAbc',
            width: 60
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
