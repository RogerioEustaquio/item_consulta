Ext.define('App.view.pvtransfproduto.TransfProdutoGridPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'pvtransfprodutogridpanel',
    id: 'transfprodutogridpanel',
    itemId: 'transfprodutogridpanel',
    title: 'Simula Transf. Produto',
    layout: 'auto',
    requires: [
        'App.view.pvtransfproduto.TransfProdutoGridLista'
    ],

    constructor: function() {
        var me = this;

        var empdest = Ext.create('Ext.form.ComboBox',{
            width: 70,
            fieldLabel: 'Destino',
            name: 'empresa2',
            id: 'comboempresa',
            margin: '0 0 0 10',
            store: Ext.data.Store({
                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/transfproduto/listarempresauser',
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            queryParam: 'codigo',
            queryMode: 'local',
            displayField: 'nome',
            emptyText: 'Emp',
            forceSelection: true,
            disabled: true,
            listeners: {

            }
        });

        empdest.store.load(function(r){
            empdest.enable();
            empdest.select(USUARIO.empresa);

            var proxyprod = empdest.up('panel').down('#comboproduto2').getStore().getProxy();
            proxyprod.setExtraParams({emp: USUARIO.empresa});

        });

        var emporig = Ext.create('Ext.form.ComboBox',{
            width: 70,
            margin: '0 0 0 10',
            fieldLabel: 'Origem',
            name: 'empresa',
            id: 'comboempresa2',
            store: Ext.data.Store({
                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/transfproduto/listarempresas',
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            queryParam: 'codigo',
            queryMode: 'remote',
            displayField: 'nome',
            emptyText: 'Emp',
            forceSelection: true,
            listeners: {
            }
        });

        var combprod = Ext.create('Ext.form.ComboBox',{
            fieldLabel: 'Produto', 
            width: 300,
            labelWidth: 200,
            margin: '0 0 0 10',
            name: 'produto2',
            id: 'comboproduto2',
            store: Ext.data.Store({
                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/transfproduto/listarprodutos',
                    reader: { type: 'json', root: 'data' },
                    extraParams: { emp: this.empresa }
                }
            }),
            queryParam: 'codigo',
            queryMode: 'remote',
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',		                            
                '{codItem} {descricao} {marca}',
                '</tpl>'), 
            valueField: 'codItem',
            emptyText: 'Informe o código do produto',
            matchFieldWidth: false,
            forceSelection: true,
            minChars: 5,
            listeners: {                    
            },
            allowBlank: false, 
            listConfig: {
                loadingText: 'Carregando...',
                emptyText: '<div class="notificacao-red">Nenhuma produto encontrado!</div>',
                getInnerTpl: function() {
                    return '{[ values.codItem]} {[ values.descricao]} {[ values.marca]}';
                }
            }
        });

        var badd = Ext.create('Ext.button.Button',{
            iconCls: 'fa fa-plus',
            margin: '26 0 0 10',
            tooltip: 'Consulta',
            listeners: {
                click: function(){

                    var myform =  this.up('form');
                    var listaStore = myform.up('panel').down('grid').getStore();

                    var empdest = myform.down('#comboempresa').getSelection();
                    var emporig = myform.down('#comboempresa2').getSelection();
                    var produto = myform.down('#comboproduto2').getSelection();

                    if(empdest){
                        empdest = empdest.getData().nome;
                    }
                    if(emporig){
                        emporig = emporig.getData().nome;
                    }
                    if(produto){
                        var cdprod = produto.getData().codItem;
                        var marca = produto.getData().marca;
                        var pdesc = produto.getData().descricao;
                    }

                    if(empdest && emporig && produto ){

                        listaStore.add(
                            {
                            emp : empdest,
                            marca : marca,
                            coditem : cdprod,
                            descricao: pdesc,
                            frete:'',
                            total:''}
                        );

                    }else{
                        Ext.Msg.alert('Alerta','Existe prametros para preencher!');
                    }
                }                 
            }
        });

        // badd.;

        Ext.applyIf(me, {

            items: [
                {
                    xtype: 'form',
                    layout: {
                        type: 'hbox'
                    },
                    margin: '0 0 10 0',
                    border: false,
                    defaults: {
                        labelAlign: 'top'
                    },
                    items: [
                        empdest,
                        emporig,
                        combprod,
                        badd
                    ]
                },
                {
                    xtype: 'pvtransfprodutogridlista'
                },
                {
                    xtype: 'panel', //
                    bbar:{
                        border: false,
                        items: [
                            '->',
                            {
                                xtype: 'form',
                                border: false,
                                layout: {
                                    type: 'hbox'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'vfrete',
                                        fieldLabel: 'Frete',
                                        margin: '2 2 2 2',
                                        size: '10',
                                        labelAlign: 'right',
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Simular',
                                        margin: '2 2 2 2',
                                        listeners:{
                                            click: function(){
                                                console.log('Click Simular');
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        });

        me.callParent(arguments);

    }


});