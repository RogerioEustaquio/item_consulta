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
                        custoContabil = me.formatreal(custoContabil);
                    }

                    if(empdest && emporig && produto ){

                        var formbar = me.down('toolbar').down('form');

                        var objTotal = formbar.down('#vtotal');
                        // var ttotal = me.desformatreal(objTotal.getValue());

                        var objProd = formbar.down('#vproduto');
                        // var tprod = me.desformatreal(objProd.getValue());
                        var somaproduto = 0;

                        var objTfrete = formbar.down('#vtfrete');
                        var vtfrete = me.desformatreal(objTfrete.getValue());

                        // loop para ler grid 
                        // recalcular itens que já existem.
                        var array = listaStore.getData().items;
                        var naoadd = false;
                        var ratfrete = 0;
                        var qtprod2 = 1;
                        var element = '';
                        for (let index = 0; index < array.length; index++) {

                            element = listaStore.getAt(index).getData();

                            if(cdprod == element.coditem){

                                naoadd = true;

                                qtprod2 = parseFloat(qtprod) + parseFloat(element.qtproduto);
                                vproduto = parseFloat(qtprod2) * parseFloat(custoContabil);
                                vproduto = me.formatreal(vproduto);

                                listaStore.getAt(index).set('produto',vproduto);
                                listaStore.getAt(index).set('qtproduto',qtprod2);
                                listaStore.getAt(index).set('total',vproduto);

                                somaproduto = parseFloat(somaproduto) + parseFloat(vproduto);

                            }else{

                                vproduto = parseFloat(element.produto);
                                somaproduto = parseFloat(somaproduto) + parseFloat(vproduto);
                            }
                        }
                        // Fim loop para ler grid 

                        if(naoadd != true){

                            vproduto = qtprod * custoContabil;
                            vproduto = me.formatreal(vproduto);
  
                            listaStore.add(
                                {
                                    emp : empdest,
                                    orig : emporig,
                                    custocontabil: custoContabil,
                                    marca : marca,
                                    coditem : cdprod,
                                    descricao: pdesc,
                                    qtproduto : qtprod,
                                    frete: ratfrete,
                                    produto: vproduto,
                                    total: vproduto
                                });

                            somaproduto = parseFloat(somaproduto) + parseFloat(vproduto);

                        }

                        objProd.setValue(me.utilFormat(somaproduto)); // total sem frete
                        objTotal.setValue(me.utilFormat(somaproduto)); // total sem frete

                        me.calcularProdutos();

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
                                        id: 'vproduto',
                                        name: 'Produto',
                                        fieldLabel: 'Produto',
                                        margin: '2 2 2 2',
                                        value: '0,00',
                                        labelAlign: 'right',
                                        labelWidth: 46,
                                        hidden: false
                                    },
                                    {
                                        xtype: 'displayfield',
                                        id: 'vtfrete',
                                        name: 'Frete',
                                        fieldLabel: 'Frete',
                                        margin: '2 2 2 2',
                                        value: '0,00',
                                        labelAlign: 'right',
                                        labelWidth: 38,
                                        hidden: false
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
        // console.log('entrou');
        var mystore = me.down('grid').getStore();
        var mydata = mystore.getData();
        var array = mydata.items;

        var objform = me.down('toolbar').down('form');
        var tproduto = objform.down('#vproduto').getValue();
        var tFrete = objform.down('#vfrete').getValue();
        // var ttotal = objform.down('#vtotal').getValue();
        var antFrete = objform.down('#vtfrete').getValue();
        // console.log(tproduto);
        // Formata para calculo
        tproduto = me.desformatreal(tproduto);
        tFrete = me.desformatreal(tFrete);
        // ttotal = me.desformatreal(ttotal);
        antFrete = me.desformatreal(antFrete);

        var cont = array.length;
        var somafrete = 0;
        var ttotal = 0;
        for (let index = 0; index < cont; index++) {

            var element = mystore.getAt(index).getData();

            var auxprod = parseFloat(element.produto);
            var auxtotal = parseFloat(element.total);

            var vcoeficiente = (parseFloat(auxprod) / parseFloat(tproduto));

            if(parseFloat(tFrete)>0){
                var vratfrete = parseFloat(tFrete) * parseFloat(vcoeficiente);
                vratfrete = me.formatreal(vratfrete);
                somafrete = parseFloat(somafrete) + parseFloat(vratfrete);
                mystore.getAt(index).set('frete',vratfrete); // record

                auxtotal = parseFloat(auxprod) + parseFloat(vratfrete);
                mystore.getAt(index).set('total',auxtotal); // record

                ttotal = parseFloat(ttotal) + parseFloat(auxtotal);

                objform.down('#vtfrete').setValue(utilFormat.Value(somafrete));

            }else{

                mystore.getAt(index).set('frete',0); // record
                mystore.getAt(index).set('total',auxprod); // record

                ttotal = parseFloat(ttotal) + parseFloat(auxprod);

                objform.down('#vtfrete').setValue(utilFormat.Value(0.00));

            }
            
        }
        // console.log('ttotal: '+ttotal);
        objform.down('#vtotal').setValue(utilFormat.Value(ttotal)); // total com frete
        
        // ajuste frete rat no ultimo produto da lista
        if(parseFloat(tFrete) != parseFloat(somafrete)){
            index = cont - 1;
            element = mystore.getAt(index).getData();
           
            ratfrete = me.ajusterat(element.frete,somafrete,tFrete);

            somafrete =  parseFloat(somafrete) - parseFloat(element.frete); // retira ultimo rateiro freta para adicionar novo
            somafrete =  parseFloat(somafrete) + parseFloat(ratfrete); // Adiciona rateio frete novo
            
            auxtotal = parseFloat(element.produto) + parseFloat(ratfrete);

            ttotal =  parseFloat(ttotal) - parseFloat(element.total); // retira total anterior
            ttotal =  parseFloat(ttotal) + parseFloat(auxtotal); // Adiciona rateio frete novo no total
            
            mystore.getAt(index).set('frete',ratfrete);
            mystore.getAt(index).set('total',auxtotal); // record

            objform.down('#vtfrete').setValue(utilFormat.Value(somafrete));
            objform.down('#vtotal').setValue(utilFormat.Value(ttotal)); // total com frete
        }
        //////////////////////////////////////////////////////////////

    },

    ajusterat: function(evalor,somavalor,vtotal){
        var me = this;
        var dif = 0;
        var ratvalor = evalor;

        if(parseFloat(evalor)>0){
        
            if(parseFloat(somavalor) > parseFloat(vtotal)){

                dif = parseFloat(somavalor) - parseFloat(vtotal);
                dif = me.formatreal(dif);
                ratvalor = parseFloat(evalor) - parseFloat(dif);
                ratvalor = me.formatreal(ratvalor);
        
            }else if(parseFloat(somavalor) < parseFloat(vtotal)){
        
                dif = parseFloat(vtotal) - parseFloat(somavalor);
                dif = me.formatreal(dif);
                ratvalor = parseFloat(evalor) + parseFloat(dif);
                ratvalor = me.formatreal(ratvalor);
            }
        }
        
        return ratvalor;

    },

    calcularateiofrete: function(vproduto){

        var utilFormat = Ext.create('Ext.ux.util.Format');

        var formbar = this.down('toolbar').down('form');

        var objProd = formbar.down('#vproduto');
        var ttotal = this.desformatreal(objProd.getValue());

        var objFrete = formbar.down('#vtfrete');
        var tfrete = this.desformatreal(objFrete.getValue());

        if(parseFloat(ttotal)<= 0){
            ttotal = parseFloat(vproduto); // total mais o valor do produto
        }

        var vcoeficiente = 1;
        if(parseFloat(ttotal)>0){
            vcoeficiente = (parseFloat(vproduto) / parseFloat(ttotal));
        }

        var freteRat = 0;
        if(parseFloat(tfrete)>0){

            freteRat = parseFloat(vcoeficiente) * parseFloat(tfrete);
            freteRat = this.formatreal(freteRat);
        }

        return freteRat;

    },

    utilFormat : function(value){

        var utilFormat = Ext.create('Ext.ux.util.Format');
        value = utilFormat.Value(value);
        return value;

    },

    formatreal: function(valor){

        var utilFormat = Ext.create('Ext.ux.util.Format');

        valor = utilFormat.Value(valor);
        valor = valor.toString().replace("\.","");
        valor = valor.toString().replace("\,","\.");

        return valor;
    },

    desformatreal: function(valor){

        valor = valor.toString().replace("\.","");
        valor = valor.toString().replace("\,","\.");

        return valor;
    },

    somaproduto: function(){
        var me = this;
        console.log('entrou');
        var formbar = me.down('toolbar').down('form');
        var listaStore = me.up('panel').down('grid').getStore();
        console.log(listaStore.getData());
        var array = listaStore.getData().items;
        var element = '';
        var qtproduto = 1;
        var objProd = formbar.down('#vproduto');
        console.log(objProd);

        var vproduto = 0;
        var vlcusto = 0;
        for (let index = 0; index < array.length; index++) {

            element = listaStore.getAt(index).getData();
            
            qtproduto = parseFloat(element.qtproduto);
            vlcusto = parseFloat(element.custoContabil);

            vproduto = parseFloat(qtproduto) * parseFloat(vlcusto);

            console.log(vproduto);
                
            objProd.setValue(me.utilFormat(vproduto)); // total sem frete

        }
        // Fim loop para ler grid 
    }

});