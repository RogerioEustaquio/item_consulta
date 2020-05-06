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

                                var utilFormat = Ext.create('Ext.ux.util.Format');  

                                var listaStore = grid.getStore();
                                var rec = listaStore.getAt(rowIndex);

                                var totalLinha = rec.get('total');
                                totalLinha = utilFormat.Value(totalLinha);
                                // Formata para calculo
                                totalLinha = totalLinha.toString().replace("\.","");
                                totalLinha = totalLinha.replace("\,","\.");

                                var objtotal = me.up('panel').down('toolbar').down('form').down('#vtotal');

                                // Formata para calculo
                                var ttotal = objtotal.value.toString().replace("\.","");
                                ttotal = ttotal.replace("\,","\.");

                                ttotal = parseFloat(ttotal) - parseFloat(totalLinha);

                                objtotal.setValue(utilFormat.Value(ttotal));

                                listaStore.removeAt(rowIndex);

                                if(listaStore.getCount() <= 0){
                                    me.up('panel').down('form').down('#comboempresa2').setDisabled(false);
                                    objtotal.setValue(utilFormat.Value(0));
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
                    text: 'Quantidade',
                    dataIndex: 'qtproduto',            
                    width: 100
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