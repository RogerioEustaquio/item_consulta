Ext.define('App.view.pvvaloresproduto.ValoresProdutoGridLista', {
    extend: 'Ext.grid.Panel',
    xtype: 'pvvaloresprodutogridlista',
    id: 'valoresprodutogridlista',
    itemId: 'valoresprodutogridlista',
    requires: [
        'Ext.ux.util.Format'
    ],
    constructor: function(config) {
        var utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.view.pvvaloresproduto.modelgrid', {
            extend: 'Ext.data.Model',
            fields:[{name:'emp',mapping:'emp'},
                    {name:'marca',mapping:'marca'},
                    {name:'codItem',mapping:'codItem'},
                    {name:'descricao',mapping:'descricao'},
                    {name:'locacao',mapping:'locacao'},
                    {name:'icms',mapping:'icms',type:'number'},
                    {name:'pisCofins',mapping:'pisCofins',type:'number'},
                    {name: 'preco',mapping:'preco',type:'number'},
                    // {name: 'precoSugerido',mapping:'precoSugerido'},
                    {name:'percDescontoMax',mapping:'percDescontoMax',type:'number'},
                    {name:'estoque',mapping:'estoque'}
                    ]
        });

        Ext.applyIf(this, {

            store: Ext.create('Ext.data.Store', {
                model: 'App.view.pvvaloresproduto.modelgrid',
                proxy: {
                    type: 'ajax',
                    method:'POST',
                    url : BASEURL + '/api/precosugerido/listarprecosugerido',
                    encode: true,
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
                    dataIndex: 'codItem',
                    width: 110
                },
                {
                    text: 'Descrição ',
                    dataIndex: 'descricao',            
                    flex: 1
                },
                {
                    text: 'Locação ',
                    dataIndex: 'locacao',            
                    width: 120
                },
                {
                    text: 'Icms',
                    dataIndex: 'icms',
                    width: 80,
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'Pis Cofins',
                    dataIndex: 'pisCofins',
                    width: 100,
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                {
                    text: 'Preço',
                    dataIndex: 'preco',
                    width: 100,
                    renderer: function (v) {
                        return utilFormat.Value(v);
                    }
                },
                // {
                //     header: 'Preço Sugerido',
                //     dataIndex: 'precoSugerido',
                //     flex: 1,
                //     width: 120
                // },
                {
                    text: 'Desconto Máx.',
                    dataIndex: 'percDescontoMax',
                    width: 120
                },
                {
                    text: 'Estoque',
                    dataIndex: 'estoque',
                    width: 100
                }
            ],
            listeners: {
                rowclick: function (grd, e) {
        
                    var valor = e.data.codItem;
                    var mygrid = this.up('panel').up('#valoresprodutomain').down('#tabdetalhe');
        
                    mygrid.setCollapsed(false);
        
                    mygrid = mygrid.down('grid');
        
                    var storeLista = mygrid.getStore();
                    var proxyprod = storeLista.getProxy();
        
                    proxyprod.setExtraParams({param1: valor});
        
                    storeLista.reload();

                }
            }
        });

        this.callParent(arguments);
    }
});