Ext.define('App.view.pvtransfproduto.TransfProdutoPedidoGridLista',{
    extend: 'Ext.grid.Panel',
    xtype: 'transfprodutopedidogridlista',
    id: 'transfprodutopedidogridlista',
    itemId: 'transfprodutopedidogridlista',
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
                    {name:'total',mapping:'total',type:'number'},
                    {name:'preco',mapping:'preco',type:'number'}
                    ]
        });

        var coldel = {
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
                                    var tform = mypanel.down('toolbar').down('#formsimula');
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
                    };

        var coldest =   {
                            text: 'Emp',
                            width: 52,
                            dataIndex: 'emp'
                        };
        var colorig =   {
                            text: 'Orig',
                            width: 52,
                            dataIndex: 'orig',
                            hidden: false
                        };
        var colmarca =  {
                            text: 'Marca ',
                            dataIndex: 'marca',
                            width: 140
                        };
        var colcodigo = {
                            text: 'Codigo',
                            dataIndex: 'coditem',
                            width: 110
                        };
        var coldesc  =  {
                            text: 'Descrição ',
                            dataIndex: 'descricao',  
                            minWidth: 66,          
                            flex: 1
                        };
        var colloca =   {
                            text: 'Locação',
                            dataIndex: 'locacao',            
                            width: 120
                        };
        var colquant =  {
                            text: 'Quantidade',
                            dataIndex: 'qtproduto',            
                            width: 100
                        };
        var colcustoproduto =   {
                                    text: 'Custo Produto',
                                    dataIndex: 'custoproduto',
                                    width: 112,
                                    renderer: function (v) {
                                        return utilFormat.Value(v);
                                    }
                                };
        var colfrete =  {
                            text: 'Frete',
                            dataIndex: 'frete',
                            width: 80,
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        };
        var colcustounitario =  {
                                    text: 'Custo Unitário',
                                    dataIndex: 'custounitario',
                                    width: 112,
                                    renderer: function (v) {
                                        return utilFormat.Value(v);
                                    }
                                };
        var colicms =   {
                            text: 'Icms',
                            dataIndex: 'icms',
                            width: 54,
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        };
        var colpiscof = {
                            text: 'PisCofins',
                            dataIndex: 'piscofins',
                            width: 82,
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        };
        var colmargem = {
                            text: 'Margem',
                            dataIndex: 'margem',
                            width: 72,
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        };
        var colpreco =  {
                            text: 'Preço Sugerido',
                            dataIndex: 'preco',
                            width: 118,
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        }
        var colvproduto =  {
                                text: 'Valor Produto',
                                dataIndex: 'valorproduto',
                                width: 118,
                                renderer: function (v) {
                                    return utilFormat.Value(v);
                                }
                            }

        if(USUARIO.empresa == "EC"){

            var arraycolums = [ coldel,
                                coldest,
                                colorig,
                                colmarca,
                                colcodigo,
                                coldesc,
                                colloca,
                                colquant,
                                colcustoproduto,
                                colfrete,
                                colcustounitario,
                                colicms,
                                colpiscof,
                                colmargem,
                                colpreco,
                                colvproduto
                            ];
        }else{

            var arraycolums = [ coldel,
                                colmarca,
                                colcodigo,
                                coldesc,
                                colloca,
                                colquant,
                                colfrete,
                                colpreco,
                                colvproduto
                            ];
        }

        Ext.applyIf(this, {

            store: Ext.create('Ext.data.Store', {
                model: 'App.view.pvtransfproduto.modelgrid',
                proxy: {
                    type: 'ajax',
                    method:'POST',
                    url : BASEURL + '/api/transfproduto/listarprodutosPedidos',
                    encode: true,
                    format: 'json',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                }
                ,autoLoad: false
            }),
            columns: arraycolums,
            listeners: {
            }

        });

        this.callParent(arguments);

    }


})