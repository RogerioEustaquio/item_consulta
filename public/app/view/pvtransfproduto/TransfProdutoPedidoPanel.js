Ext.define('App.view.pvtransfproduto.TransfProdutoPedidoPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'transfprodutopedidopanel',
    id: 'transfprodutopedidopanel',
    itemId: 'transfprodutopedidopanel',
    layout: 'auto',
    scrollable : true,
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

        });

        var emporig = Ext.create('Ext.form.ComboBox',{
            width: 70,
            margin: '2 2 2 2',
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

        var stats = Ext.create('Ext.form.field.ComboBox',{
            name: 'Status',
            id: 'status',
            fieldLabel: 'Status',
            margin: '2 2 2 2',
            store: Ext.create('Ext.data.Store', {
                        fields: ['status', 'name'],
                        data : [
                            {"status":"", "name":"Todos"},
                            {"status":"A", "name":"Ativo"},
                            {"status":"C", "name":"Cancelado"},
                            ]
                    }),
            queryMode: 'local',
            queryParam: 'status',
            displayField: 'name',
            valueField: 'status'
            
        });

        var btcons = Ext.create('Ext.button.Button',{
            margin: '26 0 0 10',
            text: 'Consultar',
            tooltip: 'Consultar',
            listeners: {

               click: function(){
                     
                    var gridpedido = me.down('#panelgridpedido').down('grid');
                    var myStore = gridpedido.getStore();
                    var empdest = me.down('form').down('#consempdest').getRawValue();
                    var emporig = me.down('form').down('#consemporig').getRawValue();
                    var dtinicio = me.down('form').down('#dtinicio').getRawValue();
                    var dtfim = me.down('form').down('#dtfim').getRawValue();
                    var status = me.down('form').down('#status').getValue();

                    var exParams = {
                        empdest: empdest,
                        emporig: emporig,
                        dtinicio: dtinicio,
                        dtfim: dtfim,
                        status: status
                    };
                    myStore.getProxy().setExtraParams(exParams);
                    myStore.setRemoteSort(true);
                    gridpedido.setLoading(true);
                    myStore.load(
                        function(){
                            if(myStore.isLoaded()){ // Se foi carregado true
                                gridpedido.setLoading(false);
                            }
                        }
                    );
                    
                    

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
                        stats,
                        btcons
                    ]
                },
                {
                    xtype:'container',
                    id: 'panelgridpedido',
                    margin: '2 2 2 2',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'transfprodutopedidogridlista',
                        }
                    ]
                },
                {
                    xtype:'window',
                    height: 200,
                    width: 500,
                    title: 'Cancelamento',
                    id: 'wincancela',
                    scrollable: true,
                    bodyPadding: 10,
                    constrain: true,
                    closable: true,
                    closeAction: 'method-hide',
                    hidden: true,
                    dado: '',
                    html: 'Deseja realizar o cancelamento do pedido ',
                    bbar: {

                        xtype: 'form',
                        items:[
                            {
                                xtype: 'button',
                                text: 'Confirmar',
                                margin: '2 2 2 2',
                                listeners:{
                                    click: function(){
                                        
                                        var mywin = this.up('form').up('window');
                                        var urlAction = '/api/transfproduto/cancelarPedido';

                                        var param = { idPedido: mywin.dado};

                                        mywin.setHidden(true);
                                        me.setLoading({ msg: '<b>Salvando ...</b>' });
                                        Ext.Ajax.request({
                                            url : BASEURL + urlAction,
                                            method: 'POST',
                                            params: param,
                                            success: function (response) {
        
                                                var result = Ext.decode(response.responseText);
                                                if(result.success){

                                                    me.setLoading(false);
                                                    Ext.Msg.alert('info', 'Pedido Cancelado.');
                                                    me.down('#panelgridpedido').down('grid').getStore().reload();
        
                                                }else{
                                                    Ext.Msg.alert('info', result.message);
                                                    mywin.setHidden(true);
                                                }
        
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'Cancelar',
                                margin: '2 2 2 2',
                                listeners:{
                                    click: function(){
                                        this.up('form').up('window').setHidden(true);
                                    }
                                }
                            }
                    ]
                    },
                    listeners:{
                        close: function(){
                            this.setHidden(true);
                        }
                    }
                }
            ]
         
        });

        me.callParent(arguments);

    }
    

});