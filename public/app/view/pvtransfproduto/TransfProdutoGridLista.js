Ext.define('App.view.pvtransfproduto.TransfProdutoGridLista',{
    extend: 'Ext.grid.Panel',
    xtype: 'pvtransfprodutogridlista',
    id: 'transfprodutogridlista',
    itemId: 'transfprodutogridlista',
    requires: [
        'Ext.ux.util.Format'
    ],
    constructor: function(config) {

        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.view.pvtransfproduto.modelgrid', {
            extend: 'Ext.data.Model',
            fields:[{name:'#',mapping:'#'},
                    {name:'emp',mapping:'emp'},
                    {name:'marca',mapping:'marca'},
                    {name:'coditem',mapping:'coditem'},
                    {name:'descricao',mapping:'descricao'},
                    {name:'frete',mapping:'frete',type:'number'},
                    {name:'total',mapping:'total',type:'number'}
                    ]
        });

        Ext.applyIf(this, {

            store: Ext.create('Ext.data.Store', {
                model: 'App.view.pvtransfproduto.modelgrid',
                // proxy: {
                //     type: 'ajax',
                //     method:'POST',
                //     url : BASEURL + '/api/transfproduto/simulacaotransf',
                //     encode: true,
                //     format: 'json',
                //     reader: {
                //         type: 'json',
                //         rootProperty: 'data'
                //     }
                // }
                // ,autoLoad: true
            }),
            columns: [
                {
                    xtype:'actioncolumn',
                    width:40,
                    items: [
                            {
                            iconCls: 'fa fa-minus',
                            tooltip: 'Remover',
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                
                                console.log(rowIndex );
                                grid.getStore().removeAt(rowIndex);

                            }
                        }]
                },
                {
                    text: 'Emp',
                    width: 52,
                    dataIndex: 'emp'
                },
                {
                    text: 'Marca ',
                    dataIndex: 'marca',
                    width: 140
                },
                {
                    text: 'Codigo',
                    dataIndex: 'coditem',
                    width: 110
                },
                {
                    text: 'Descrição ',
                    dataIndex: 'descricao',            
                    flex: 1
                },
                {
                    text: 'Frete',
                    dataIndex: 'frete',
                    width: 80,
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'Total',
                    dataIndex: 'total',
                    width: 80,
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                }
            ],
            listeners: {
            }

        });

        this.callParent(arguments);

    }


})