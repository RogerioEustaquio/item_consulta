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
                    {name:'orig',mapping:'orig'},
                    {name:'marca',mapping:'marca'},
                    {name:'coditem',mapping:'coditem'},
                    {name:'descricao',mapping:'descricao'},
                    {name:'locacao',mapping:'locacao'},
                    {name:'frete',mapping:'frete',type:'number'},
                    {name:'produto',mapping:'produto',type:'number'},
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
                    align: 'center',
                    items: [
                            {
                            iconCls: 'fa fa-times red-text',
                            tooltip: 'Remover',
                            handler: function(grid, rowIndex, colIndex) {

                                var utilFormat = Ext.create('Ext.ux.util.Format');

                                var mypanel = me.up('panel');
                                var tform = mypanel.down('toolbar').down('form');
                                var listaStore = grid.getStore();
                                var objProduto = tform.down('#vproduto');
                                var objtotal = tform.down('#vtotal');

                                var element = listaStore.getAt(rowIndex).getData();

                                var upProduto = mypanel.desformatreal(objProduto.getValue());
                                upProduto = parseFloat(upProduto) - parseFloat(element.produto);
                                objProduto.setValue(utilFormat.Value(upProduto));

                                var upTotal = mypanel.desformatreal(objtotal.getValue());
                                upTotal = parseFloat(upTotal) - parseFloat(element.total);
                                objtotal.setValue(utilFormat.Value(upTotal));

                                listaStore.removeAt(rowIndex);
                                
                                mypanel.calcularProdutos();

                                if(listaStore.getCount() <= 0){
                                    
                                    var objfrete = tform.down('#vtfrete');
                                    
                                    objtotal.setValue(utilFormat.Value(0.00));
                                    objProduto.setValue(utilFormat.Value(0.00));
                                    objfrete.setValue(utilFormat.Value(0.00));
                                }

                            }
                        }]
                },
                {
                    text: 'Emp',
                    width: 52,
                    dataIndex: 'emp'
                },
                {
                    text: 'orig',
                    width: 52,
                    dataIndex: 'orig',
                    hidden: true
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
                    text: 'Locação',
                    dataIndex: 'locacao',            
                    width: 120
                },
                {
                    text: 'Quantidade',
                    dataIndex: 'qtproduto',            
                    width: 100
                },
                {
                    text: 'Produto',
                    dataIndex: 'produto',
                    width: 80,
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
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
                    width: 90,
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