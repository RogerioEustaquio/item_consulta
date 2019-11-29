Ext.define('App.view.pvsolicitacaoalteracao.AnaliseWindow', {
    extend: 'Ext.window.Window',
    xtype: 'pvsolicitacaoalteracaoanalisewindow',
    controller: 'pvsolicitacaoalteracaoanalisewindow',

    title: 'Análise de Preço',
    width: Ext.getBody().getWidth() * 0.96,
    height: Ext.getBody().getHeight() * 0.8,
    
    autoDestroy: true,
    // maximizable: true,
    maximized: true,

    layout: 'border',
    modal: true,
    solicitacao: null,

    initComponent: function() {
        var me = this;

        me.setTitle(me.title + ' ' + me.solicitacao.get('emp') + ' ' + 
                    me.solicitacao.get('codigo') + ' ' + 
                    me.solicitacao.get('descricao') + ' ' + 
                    me.solicitacao.get('marca'))

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    region: 'center',
                    layout: 'fit',
                    items: [me.buildGrid()]
                },
                {
                    region: 'east',
                    layout: 'fit',
                    collapsible: true,
                    split: true,
                    // bodyPadding: 10,
                    width: 252,
                    title: 'Markup',
                    items: [me.buildForm()]
                }
            ]        
        });

        me.callParent(arguments);
    },

    buildGrid: function(){
        var me = this,
            utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.model.pvsolicitacaoalteracao.Simulacao', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'emp',  type: 'string' },
                { name: 'codigo',  type: 'string' },
                { name: 'icms',  type: 'number' },
                { name: 'pisCofins',  type: 'number' },
                { name: 'imposto',  type: 'number' },
                { name: 'markup',  type: 'number' },
                { name: 'preco',  type: 'number' },
                { name: 'comissao',  type: 'number' },
                { name: 'descontoLetra',  type: 'string' },
                { name: 'descontoPerc',  type: 'number' },
                { name: 'mb',  type: 'number' },
                { name: 'mbMin',  type: 'number' },
                { name: 'nmarkup',  type: 'number' },
                { name: 'npreco',  type: 'number' },
                { name: 'nmb',  type: 'number' },
                { name: 'ndescontoLetra',  type: 'string' },
                { name: 'ndescontoPerc',  type: 'number' },
                { name: 'nmbMin',  type: 'number' }
            ]
        });
        
        var cmp = {
            xtype: 'gridpanel',
            itemId: 'solicitacaosimulada',
            store: Ext.create('Ext.data.Store', {
                model: 'App.model.pvsolicitacaoalteracao.Simulacao',
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/pvsolicitacaoalteracao/simularpreco',
                    timeout: 120000,
                    reader: { type: 'json', root: 'data' },
                    extraParams: {
                        emp: me.solicitacao.get('emp'),
                        produto: me.solicitacao.get('codigo'),
                        preco: me.solicitacao.get('precoPara'),
                        descontoLetra: null,
                        descontoPerc: null
                    }
                },
                listeners: {
                    // load: function(store, records, successful){
                    //     var r = records[0],
                    //         form = me.down('#formmarkup');

                    //     form.down('[name=icms]').setValue(r.get('icms'));
                    //     form.down('[name=pisCofins]').setValue(r.get('pisCofins'));
                    //     form.down('[name=comissao]').setValue(r.get('comissao'));
                    //     form.down('[name=custo]').setValue(r.get('custo'));
                    //     form.down('[name=markup]').setValue(r.get('markup'));
                    //     form.down('[name=preco]').setValue(r.get('npreco'));
                    //     form.down('[name=mb]').setValue(r.get('nmb'));
                    //     form.down('combobox[name=desconto]').select(r.get('ndescontoLetra'));
                    //     form.down('[name=mbmin]').setValue(r.get('nmbMin'));
                    // }
                }
            }),
            columns: [
                {
                    text: 'Emp',
                    align: 'center',
                    width: 52,
                    dataIndex: 'emp'
                },

                {
                    text: 'Produto',
                    align: 'left',
                    width: 90,
                    dataIndex: 'codigo'
                }, 

                {
                    text: 'Descrição',
                    align: 'left',
                    flex: 1,
                    dataIndex: 'descricao'
                },

                {
                    hidden: true,
                    text: 'Icms',
                    align: 'right',
                    width: 80,
                    dataIndex: 'icms',
                    renderer: function (v) { return utilFormat.Value(v); }
                },

                {
                    hidden: true,
                    text: 'Pis+Cofins',
                    align: 'right',
                    width: 110,
                    dataIndex: 'pisCofins',
                    renderer: function (v) { return utilFormat.Value(v); }
                },

                {
                    text: 'Imp',
                    align: 'right',
                    width: 70,
                    dataIndex: 'imposto',
                    renderer: function (v) { return utilFormat.Value(v); }
                },

                {
                    text: 'Com. G',
                    align: 'right',
                    width: 90,
                    dataIndex: 'comissao',
                    renderer: function (v) { return utilFormat.Value(v); }
                },

                {
                    text: 'Mkp',
                    align: 'center',
                    width: 70,
                    dataIndex: 'markup',
                    renderer: function (v) { return utilFormat.Value(v); }
                },

                {
                    text: 'Preço',
                    align: 'right',
                    width: 80,
                    dataIndex: 'preco',
                    renderer: function (v) { return utilFormat.Value(v); }
                },

                {
                    text: 'Mb',
                    align: 'center',
                    width: 70,
                    dataIndex: 'mb',
                    renderer: function (v) { return utilFormat.Value(v); }
                },

                {
                    text: 'Desconto',
                    columns: [
                        {
                            text: 'Letra',
                            align: 'center',
                            width: 70,
                            dataIndex: 'descontoLetra'
                        },
        
                        {
                            text: 'Perc.',
                            align: 'center',
                            width: 70,
                            dataIndex: 'descontoPerc',
                            renderer: function (v) { return utilFormat.Value(v); }
                        },
                    ]
                },

                {
                    text: 'Mb Mín',
                    align: 'center',
                    width: 70,
                    dataIndex: 'mbMin',
                    renderer: function (v) { return utilFormat.Value(v); }
                },

                {
                    text: 'Com Alteração',
                    columns: [
                        {
                            text: 'Mkp',
                            align: 'center',
                            width: 70,
                            dataIndex: 'nmarkup',
                            renderer: function (v) { return utilFormat.Value(v); }
                        },

                        {
                            text: 'Preço',
                            align: 'right',
                            width: 80,
                            dataIndex: 'npreco',
                            renderer: function (v) { return utilFormat.Value(v); }
                        },
        
                        {
                            text: 'Mb',
                            align: 'center',
                            width: 70,
                            dataIndex: 'nmb',
                            renderer: function (v) { return utilFormat.Value(v); }
                        },

                        {
                            text: 'Letra',
                            align: 'center',
                            width: 70,
                            dataIndex: 'ndescontoLetra'
                        },
        
                        {
                            text: 'Perc.',
                            align: 'center',
                            width: 70,
                            dataIndex: 'ndescontoPerc',
                            renderer: function (v) { return utilFormat.Value(v); }
                        },

                        {
                            text: 'Mb Mín',
                            align: 'center',
                            width: 70,
                            dataIndex: 'nmbMin',
                            renderer: function (v) { return utilFormat.Value(v); }
                        }
                    ]
                }
            ]
        };

        return cmp;
    },

    buildForm: function(){
        var me = this;

        var cmp = {
            
            xtype: 'form',
            itemId: 'formmarkup',
            bodyPadding: '5 5 5 5',
            defaults: {
                // labelAlign: "right",
                xtype: 'numberfield',
                labelWidth: 110,
                // labelStyle: 'font-weight: bold;',
                paddin: 0,
                margin: 0,
                anchor: '100%'
            },
            items: [
                {   
                    fieldLabel: 'icms', 
                    xtype: 'displayfield',
                    name: 'icms'
                },

                {   
                    fieldLabel: 'Pis+Cofins',
                    xtype: 'displayfield', 
                    name: 'pisCofins'
                },

                {   
                    // disabled: true,
                    fieldLabel: 'Comissão', 
                    name: 'comissao'
                },

                {   
                    fieldLabel: 'Custo', 
                    xtype: 'displayfield',
                    name: 'custo'
                },

                {   
                    fieldLabel: 'Markup', 
                    xtype: 'displayfield',
                    name: 'markup'
                },
               
                {   
                    fieldLabel: 'Preço', 
                    name: 'preco'
                },

                {   
                    fieldLabel: 'Margem', 
                    xtype: 'displayfield',
                    name: 'mb'
                },

                {
                    fieldLabel: 'Desconto', 
                    xtype: 'combobox',
                    name: 'desconto',
                    store: Ext.data.Store({
                        autoLoad: true,
                        fields: [{ name: 'idDescontoLetra' }, 
                                 { name: 'valor' },
                                 { name: 'letraDescricao' },
                                 { name: 'letra' }],
                        proxy: {
                            type: 'ajax',
                            url: BASEURL + '/api/pvsolicitacaoalteracao/listarletrasdesconto',
                            reader: { type: 'json', root: 'data' },
                            extraParams: {
                                emp: me.solicitacao.get('emp')
                            }
                        },
                        listeners: {
                            load(){
                                // Atualiza a simulação
                                me.down('#solicitacaosimulada').getStore().load();
                            }
                        }
                    }),
                    queryMode: 'local',
                    displayField: 'letra',
                    valueField: 'idDescontoLetra',
                    emptyText: 'Letra de desconto',
                    forceSelection: true,
                    listeners: {
                        select: function ( combo, record ) {
                            
                        }
                    }
                },

                // {   
                //     fieldLabel: 'Desconto', 
                //     xtype: 'textfield',
                //     name: 'desconto'
                // },

                {   
                    fieldLabel: 'Margem Mínima', 
                    xtype: 'displayfield',
                    name: 'mbmin'
                },

                {
                    margin: '10 0 0 0',
                    xtype: 'textarea',
                    labelAlign: 'top',
                    // allowBlank: false,
                    name: 'comentario',
                    emptyText: 'Comentário'
                }
            ],

            tbar: [
                {
                    tooltip: 'Simular Markup',
                    iconCls: 'fa fa-calculator',
                    handler: 'onBtnSimularClick'
                },

                {
                    tooltip: 'Resetar',
                    iconCls: 'fa fa-redo-alt',
                    handler: 'onBtnResetarClick'
                } 

            ],

            buttons: [

                {
                    text: 'Aprovar',
                    action: 'aprovar',
                    // formBind: true, 
                    // disabled: true,
                    handler: 'onBtnAprovarClick'
                }, 

                {
                    text: 'Alterar',
                    action: 'alterar',
                    // formBind: true, 
                    // disabled: true,
                    handler: 'onBtnAlterarClick'
                }, 

                {
                    text: 'Reprovar',
                    action: 'reprovar',
                    // formBind: true, 
                    // disabled: true,
                    handler: 'onBtnReprovarClick'
                }
            ]
        };

        return cmp;
    }

});