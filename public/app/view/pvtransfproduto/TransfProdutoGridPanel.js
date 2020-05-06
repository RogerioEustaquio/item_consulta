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
        var utilFormat = Ext.create('Ext.ux.util.Format');

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
                fields: [{ name: 'coditem' }, { name: 'descricao' }, { name: 'custoContabil',type: 'number' }],
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

        var textqt = Ext.create('Ext.form.field.Text',{
            fieldLabel: 'Quantidade',
            width: 74,
            margin: '0 0 0 10',
            name: 'qtproduto',
            id: 'qtproduto',
            value: 1
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
                    var qtprod = myform.down('#qtproduto').getValue();

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
                        var custoContabil = produto.getData().custoContabil;
                    }

                    var vtotal = qtprod * custoContabil;

                    if(empdest && emporig && produto ){

                        var formbar = me.down('toolbar').down('form');
                        var objTotal = formbar.down('#vtotal');
                        //Formatar valor para calculo
                        var ttotal = objTotal.getValue().toString().replace("\.","");
                        ttotal = ttotal.replace("\,","\.");


                        // loop para ler grid 
                        // recalcular item se já existir.
                        var array = listaStore.getData().items;
                        var naoadd = false;
                        for (let index = 0; index < array.length; index++) {

                            var element = listaStore.getAt(index).getData();

                            if(cdprod == element.coditem){

                                naoadd = true;

                                qtprod = parseFloat(qtprod) + parseFloat(element.qtproduto);

                                listaStore.getAt(index).set('qtproduto',qtprod);

                                var vtotal2 = parseFloat(vtotal) + parseFloat(element.total);
                                listaStore.getAt(index).set('total',vtotal2);

                            }
                            console.log(element);
                            
                        }

                        if(naoadd != true){

                            listaStore.add(
                                {
                                emp : empdest,
                                orig : emporig,
                                custocontabil: custoContabil,
                                marca : marca,
                                coditem : cdprod,
                                descricao: pdesc,
                                qtproduto : qtprod,
                                frete: '',
                                total: vtotal}
                            );

                        }

                        ttotal = parseFloat(ttotal) + parseFloat(vtotal);
                        objTotal.setValue(utilFormat.Value(ttotal));

                        if(listaStore.getCount() > 0){
                            myform.down('#comboempresa2').setDisabled(true);
                        }

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
                        textqt,
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
                                        id:'vfrete',
                                        name: 'vfrete',
                                        fieldLabel: 'Frete',
                                        margin: '2 2 2 2',
                                        size: '10',
                                        labelAlign: 'right',
                                        value: utilFormat.Value(0)
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Simular',
                                        margin: '2 2 2 2',
                                        listeners:{
                                            click: function(){
                                               
                                                me.calcularProdutos();

                                            }
                                        }
                                    },
                                    {
                                        xtype: 'displayfield',
                                        id: 'vtotal',
                                        name: 'vtotal',
                                        fieldLabel: 'Total',
                                        margin: '2 42 2 2',
                                        value: '0,00',
                                        labelAlign: 'right',
                                        labelWidth: 38
                                    },
                                    {
                                        xtype: 'displayfield',
                                        id: 'vtfrete',
                                        name: 'vtfrete',
                                        fieldLabel: 'vtfrete',
                                        margin: '2 42 2 2',
                                        value: '0,00',
                                        labelAlign: 'right',
                                        labelWidth: 38,
                                        hidden: true
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        });

        me.callParent(arguments);

    },
    
    calcularProdutos: function() {
        var me = this;
        var utilFormat = Ext.create('Ext.ux.util.Format');  

        var mystore = me.down('grid').getStore();
        var mydata = mystore.getData();
        var array = mydata.items;

        var objform = me.down('toolbar').down('form');
        var tFrete = objform.down('#vfrete').getValue();
        var ttotal = objform.down('#vtotal').getValue();
        var antFrete = objform.down('#vtfrete').getValue();
        console.log(antFrete);
        // Formata para calculo
        tFrete = tFrete.toString().replace("\.","");
        tFrete = tFrete.replace("\,","\.");
        ttotal = ttotal.toString().replace("\.","");
        ttotal = ttotal.replace("\,","\.");
        antFrete = antFrete.toString().replace("\.","");
        antFrete = antFrete.replace("\,","\.");

        ttotal = parseFloat(ttotal) - parseFloat(antFrete);

        console.log(ttotal);

        var cont = array.length;
        antFrete = 0;
        for (let index = 0; index < cont; index++) {

            var element = mystore.getAt(index).getData();
            console.log(element);

            var auxtotal = utilFormat.Value(element.total);
            // Formata para calculo
            auxtotal = auxtotal.toString().replace("\.","");
            auxtotal = auxtotal.replace("\,","\.");

            var auxfrete = utilFormat.Value(element.frete);
            // Formata para calculo
            auxfrete = auxfrete.toString().replace("\.","");
            auxfrete = auxfrete.replace("\,","\.");

            if(parseFloat(auxfrete)>0){

                auxtotal = parseFloat(auxtotal) - parseFloat(auxfrete);
            }

            console.log(auxtotal);

            var vcoeficiente = (parseFloat(auxtotal) / parseFloat(ttotal));

            if(parseFloat(tFrete)>0){
                var vratfrete = parseFloat(tFrete) * parseFloat(vcoeficiente);
                element.frete = vratfrete;
                mystore.getAt(index).set('frete',vratfrete); // record
                
                auxtotal = parseFloat(auxtotal) + parseFloat(vratfrete);
                element.total = auxtotal;
                mystore.getAt(index).set('total',auxtotal); // record

                ttotal = parseFloat(ttotal) + parseFloat(vratfrete); // soma + frete rateado
                objform.down('#vtotal').setValue(utilFormat.Value(ttotal));

                antFrete = parseFloat(antFrete) + parseFloat(vratfrete);
                // // Formata para calculo
                // antFrete = antFrete.toString().replace("\.","");
                // antFrete = antFrete.replace("\,","\.");
                objform.down('#vtfrete').setValue(utilFormat.Value(antFrete));

            }
            
        }

    },

});