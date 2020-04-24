Ext.define('App.view.pvvaloresproduto.ValoresProdutoGridPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'pvvaloresprodutogridpanel',
    id: 'valoresprodutogridpanel',
    itemId: 'valoresprodutogridpanel',
    title: 'Consulta Produto',
    requires: [
        'App.view.pvvaloresproduto.ValoresProdutoGridLista'
    ],
    tbar: {
        items: [
            {
                width: 70,
                xtype: 'combobox',
                name: 'empresa',
                itemId: 'comboempresa',
                store: Ext.data.Store({
                    fields: [{ name: 'coditem' }, { name: 'descricao' }],
                    proxy: {
                        type: 'ajax',
                        url: BASEURL + '/api/precosugerido/listarempresas',
                        reader: { type: 'json', root: 'data' }
                    }
                }),
                queryParam: 'codigo',
                queryMode: 'remote',
                displayField: 'nome',
                valueField: 'nome',
                emptyText: 'Emp',
                forceSelection: true,
                listeners: {
                    // select: 'onEmpresaSelect'
                    select: function (form){
          
                        var valor = form.getRawValue();
                        var proxyprod = this.up('panel').down('#comboproduto').getStore().getProxy();

                        proxyprod.setExtraParams({emp: valor});
                    }
                    
                }
            },
            {
                // fieldLabel: 'Produto', 
                width: 300,
                labelWidth: 200,
                xtype: 'combobox',
                name: 'produto',
                id: 'comboproduto',
                store: Ext.data.Store({
                    fields: [{ name: 'coditem' }, { name: 'descricao' }],
                    proxy: {
                        type: 'ajax',
                        url: BASEURL + '/api/precosugerido/listarprodutos',
                        reader: { type: 'json', root: 'data' }
                        // extraParams: { emp: this.empresa }
                    }
                }),
                queryParam: 'codigo',
                queryMode: 'remote',
                // displayField: 'codItem',
                displayTpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">',		                            
                    '{codItem} {descricao} {marca}',
                    '</tpl>'), 
                valueField: 'codItem',
                emptyText: 'Informe o código do produto',
                matchFieldWidth: false,
                // hideTrigger: false,
                forceSelection: true,
                minChars: 5,
                // padding: '5',
                // columnWidth: 0.65,

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
            },
            // {
            //     width: 120,
            //     xtype: 'combobox',
            //     name: 'tipopessoa',
            //     id: 'combotpessoa',
            //     emptyText: 'Tipo Pessoa',
            //     store: Ext.data.Store({
            //                 fields: ['tp','tpdesc'],
            //                 data : [
            //                     {"tp":"PF", "tpdesc":"Pessoa Fisica"},
            //                     {"tp":"PJ", "tpdesc":"Pessoa Juridica"}
            //                 ]
            //             }),
            //     queryMode: 'local',
            //     displayField: 'tpdesc',
            //     valueField: 'tp',
            //     matchFieldWidth: false,
            //     // hideTrigger: false,
            //     forceSelection: true,
            // },
            {
                xtype: 'button',
                // icon: '/js/ext-6.2.0/theme-classic/resources/images/grid/filters/find.png',
                iconCls: 'fa fa-search',
                tooltip: 'Consulta',
                handler: function(form) {

                    var mygrid = form.up('panel');
                    var myemp  = mygrid.down('#comboempresa').getSelection().getData().nome;
                    var myitem = mygrid.down('#comboproduto').getSelection().getData().codItem;
                    // var mytp   = mygrid.down('#combotpessoa').getSelection().getData().tp;

                    var storeLista = mygrid.down('grid').getStore();
                    var proxyprod = storeLista.getProxy();
                    proxyprod.setExtraParams({param1: myemp, param2: myitem });

                    storeLista.reload();

                }
            }
        ]
    },
    items: [
        {
            xtype: 'pvvaloresprodutogridlista'
        }
    ]
});