Ext.define('App.view.pvtransfproduto.TransfProdutoGridPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'pvtransfprodutogridpanel',
    id: 'transfprodutogridpanel',
    itemId: 'transfprodutogridpanel',
    title: 'Simula Transf. Produto',
    layout: 'fit',

    constructor: function() {
        var me = this;

        var emporig = Ext.create('Ext.form.ComboBox',{
            width: 70,
            fieldLabel: 'Origem',
            name: 'empresa',
            itemId: 'comboempresa',
            store: Ext.data.Store({
                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/precosugerido/listarempresas',
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
                select: function (form){
        
                    var valor = form.getRawValue();

                    console.log(valor);

                }
            }
        });

        emporig.store.load(function(r){
            emporig.enable();
            emporig.select(USUARIO.empresa);

        });

        var empdest = Ext.create('Ext.form.ComboBox',{
            width: 70,
            fieldLabel: 'Destino',
            name: 'empresa2',
            itemId: 'comboempresa2',
            margin: '0 0 0 10',
            store: Ext.data.Store({
                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/precosugerido/listarempresas',
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
                    url: BASEURL + '/api/precosugerido/listarprodutos',
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
            tooltip: 'Consulta'
        });

        // badd.click(function(){
        //     console.log('Teste button click!');
        // });

        Ext.applyIf(me, {

            items: [
                {
                    xtype: 'form',
                    layout: {
                        type: 'hbox'
                    },
                    defaults: {
                        labelAlign: 'top'
                    },
                    items: [
                        emporig,
                        empdest,
                        combprod,
                        badd
                    ]
                }
            ]
        });

        me.callParent(arguments);

    }


});