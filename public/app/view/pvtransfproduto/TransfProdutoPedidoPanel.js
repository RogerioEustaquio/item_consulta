Ext.define('App.view.pvtransfproduto.TransfProdutoPedidoPanel', {
    extend: 'Ext.Container',
    xtype: 'transfprodutopedidopanel',
    id: 'transfprodutopedidopanel',
    itemId: 'transfprodutopedidopanel',
    layout: 'vbox',
    requires: [
    ],

    constructor: function() {
        var me = this;

        var consemp = Ext.create('Ext.form.ComboBox',{
            width: 70,
            fieldLabel: 'Destino',
            name: 'consempdest',
            id: 'consempdest',
            margin: '2 2 2 2',
            store: Ext.data.Store({
                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/transfproduto/listarEmpresaUser',
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

        consemp.store.load(function(r){
            consemp.enable();
            consemp.select(USUARIO.empresa);

            // var proxyprod = empdest.up('panel').down('#comboproduto2').getStore().getProxy();
            // proxyprod.setExtraParams({emp: USUARIO.empresa});

        });

        var emporig = Ext.create('Ext.form.ComboBox',{
            width: 70,
            margin: '0 0 0 10',
            fieldLabel: 'Origem',
            name: 'consemporig',
            id: 'consemporig',
            store: Ext.data.Store({
                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/transfproduto/listarEmpresas',
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

        var dtinicio = Ext.create('Ext.form.field.Date',{
            name: 'dtinicio',
            id: 'dtinicio',
            fieldLabel: 'Início',
            margin: '2 2 2 2',
            width: 135,
            labelWidth: 35,
            format: 'd/m/Y',
            altFormats: 'dmY',
//            maxValue: new Date(),
            emptyText: '__/__/____'
        });

        var dtfim = Ext.create('Ext.form.field.Date',{
            name: 'dtfim',
            id: 'dtfim',
            fieldLabel: 'Fim',
            margin: '2 2 2 2',
            width: 135,
            labelWidth: 35,
            format: 'd/m/Y',
            altFormats: 'dmY',
//            maxValue: new Date(),
            emptyText: '__/__/____'
        });

        var btcons = Ext.create('Ext.button.Button',{
            margin: '26 0 0 10',
            text: 'Consultar',
            tooltip: 'Consultar',
            listeners: {

               click: function(){
                    
                    var myStore = me.down('grid').getStore();
                    var empdest = me.down('form').down('#consempdest').getRawValue();
                    var emporig = me.down('form').down('#consemporig').getRawValue();
                    var dtinicio = me.down('form').down('#dtinicio').getRawValue();
                    var dtfim = me.down('form').down('#dtfim').getRawValue();

                    var exParams = {
                        empdest: empdest,
                        emporig: emporig,
                        dtinicio: dtinicio,
                        dtfim: dtfim
                    };
                    myStore.getProxy().setExtraParams(exParams);
                    myStore.setRemoteSort(false)
                    myStore.load();

               }
            }
        });
        
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
                        consemp,
                        emporig,
                        dtinicio,
                        dtfim,
                        btcons
                    ]
                },
                {
                    xtype:'panel',
                    layout: 'hbox',
                    fullscreen: true,
                    width: '100%',
                    floatable: true,
                    margin: '0 0 0 0',
                    items: [
                        {
                            xtype: 'transfprodutopedidogridlista',
                            margin: '0 0 0 0',
                            flex: 1
                        }
                    ]
                }
            ]
         
        });

        me.callParent(arguments);

    }
    

});