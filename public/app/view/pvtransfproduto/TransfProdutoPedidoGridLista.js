Ext.define('App.view.pvtransfproduto.TransfProdutoPedidoGridLista',{
    extend: 'Ext.grid.Panel',
    xtype: 'transfprodutopedidogridlista',
    id: 'transfprodutopedidogridlista',
    itemId: 'transfprodutopedidogridlista',
    requires: [
        'Ext.ux.util.Format',
        'Ext.grid.feature.Grouping'
    ],
    constructor: function(config) {

        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.view.pvtransfproduto.modelgrid', {
            extend: 'Ext.data.Model',
            fields:[
                    {name:'idPedido',mapping:'idPedido',type:'number'},
                    {name:'dtPedido',mapping:'dtPedido'},
                    {name:'empDest',mapping:'empDest'},
                    {name:'empOrig',mapping:'empOrig'},
                    {name:'marca',mapping:'marca'},
                    {name:'codItem',mapping:'codItem'},
                    {name:'descricao',mapping:'descricao'},
                    {name:'locacao',mapping:'locacao'},
                    {name:'frete',mapping:'frete',type:'number'},
                    {name:'qtProduto',mapping:'qtProduto',type:'number'},
                    {name:'precoUnitario',mapping:'precoUnitario',type:'number'},
                    {name:'totalItem',mapping:'totalItem',type:'number'},
                    {name:'totalFrete',mapping:'totalFrete',type:'number'},
                    {name:'total',mapping:'total',type:'number'},
                    'observacao',
                    {name:'idUsu',mapping:'idUsu'},
                    {name:'status',mapping:'status'}
                    ]
        });

        var colId =   {
            text: 'Pedido',
            width: 52,
            dataIndex: 'idPedido'
        };
        var coldest =   {
            text: 'Emp',
            width: 52,
            dataIndex: 'empDest'
        };
        var colorig =   {
                            text: 'Orig',
                            width: 52,
                            dataIndex: 'empOrig',
                            hidden: false
                        };
        var colmarca =  {
                            text: 'Marca ',
                            dataIndex: 'marca',
                            width: 140
                        };
        var colcodigo = {
                            text: 'Codigo',
                            dataIndex: 'codItem',
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
                            dataIndex: 'qtProduto',            
                            width: 100
                        };
        var colcustoproduto =   {
                                    text: 'Custo Produto',
                                    dataIndex: 'custoProduto',
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
                                    dataIndex: 'custoUnitario',
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
                            dataIndex: 'precoUnitario',
                            width: 118,
                            renderer: function (v) {
                                return utilFormat.Value(v);
                            }
                        }
        var colvproduto =  {
                                text: 'Valor Produto',
                                dataIndex: 'totalItem',
                                width: 118,
                                renderer: function (v) {
                                    return utilFormat.Value(v);
                                }
                            }

        if(USUARIO.empresa == "EC"){

            var arraycolums = [ colId,
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

            var arraycolums = [ colId,
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

        var text   = '{columnName}: {name} | {[values.rows[0].data.dtPedido]} | {[values.rows[0].data.idUsu]} | ';
            text   += 'Origem: {[values.rows[0].data.empOrig]} | ';
            text   += 'Frete: {[values.rows[0].data.totalFrete]} | ';
            text   += 'Total: {[values.rows[0].data.total]} | ';
            // text   += 'Status: {[values.rows[0].data.status]} | ';
            text   += 'Obs: {[values.rows[0].data.observacao]} ';

        var script = " var win = Ext.getCmp('wincancela'); ";
            script += "win.center(); ";
            script += "win.setHtml('Deseja realizar o cancelamento do pedido? <br><br>"+text+"\'); ";
            script += "win.dado={name}; ";
            script += "win.setHidden(false) ";

        var btntpl = new Ext.XTemplate( '<div style="display: inline;">',
                                         text,
                                         '</div>',
                                         '<div style="float:right;display: inline;">',
                                         '<button type="button" id="btn_click{name}" class="fa fa-times red-text" onclick="'+script+'"</button>',
                                         '</div>');

        Ext.applyIf(this, {

            store: Ext.create('Ext.data.Store', {
                model: 'App.view.pvtransfproduto.modelgrid',
                groupField: 'idPedido',
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    method:'POST',
                    url : BASEURL + '/api/transfproduto/listarProdutosPedidos',
                    encode: true,
                    format: 'json',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                }
                
            }),
            columns: arraycolums,
            features: [{
                ftype:'grouping',
                groupHeaderTpl: btntpl ,
                hideGroupHeader: true,
                startCollapsed: true,
            }]

        });

        this.callParent(arguments);

    }

})