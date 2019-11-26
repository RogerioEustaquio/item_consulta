Ext.define('App.view.pvsolicitacaocadastro.NovaSolicitacaoWindow', {
    extend: 'Ext.window.Window',
    xtype: 'pvsolicitacaocadastronovasolicitacaowindow',
    requires: [
        'App.view.pvsolicitacaocadastro.NovaSolicitacaoWindowController'
    ],

    controller: 'pvsolicitacaocadastronovasolicitacao',

    title: 'Nova solicitação',
    width: 600,
    // height: Ext.getBody().getHeight() * 0.6,
    // minHeight: 400,
    layout: 'fit',
    modal: true,
    empresa: null,

    constructor: function(config) {
        var me = this;

        Ext.applyIf(me, {
            
        });

        me.callParent(arguments);
    },

    initComponent: function() {
        var me = this;

        me.setTitle(me.title + ' ' + me.empresa)

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    bodyPadding: '5 5 5 5',
                    defaults: {
                        labelAlign: "right",
                        labelStyle: 'font-weight: bold;',
                        anchor: '100%'
                    },
                    items: [

                        {
                            xtype: 'hiddenfield',
                            name: 'emp',
                            value: me.empresa
                        },
                        
                        {
                            fieldLabel: 'Produto', 
                            labelWidth: 120,
                            xtype: 'combobox',
                            name: 'produto',
                            store: Ext.data.Store({
                                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                                proxy: {
                                    type: 'ajax',
                                    url: BASEURL + '/api/pvsolicitacaocadastro/listarprodutos',
                                    reader: { type: 'json', root: 'data' },
                                    extraParams: { emp: me.empresa }
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

                        {
                            allowBlank: false, 
                            inputType: 'numberfield', 
                            xtype: 'numberfield', 
                            minValue: 0, 
                            labelWidth: 120,
                            // width: 220,
                            decimalSeparator: ',', 
                            fieldLabel: 'Custo do Produto', 
                            name: 'custo'
                        },

                        {
                            allowBlank: true, 
                            inputType: 'numberfield', 
                            xtype: 'numberfield', 
                            minValue: 0, 
                            labelWidth: 120,
                            // width: 220,
                            decimalSeparator: ',', 
                            fieldLabel: 'Preço Sugerido', 
                            name: 'precoSugerido'
                        },

                        {
                            margin: '10 0 0 0',
                            xtype:'textarea',
                            labelAlign: 'top',
                            allowBlank: true,
                            name: 'comentario',
                            emptyText: 'Comentário de solicitação'
                        }

                    ],
                    buttons: [
                        {
                            text: 'Confirmar',
                            action: 'confirmar',
                            formBind: true, 
                            disabled: true,
                            handler: 'onBtnConfirmarClick'
                        }, 
                        {
                            text: 'Cancelar',
                            action: 'cancelar',
                            handler: function() {
                                var me = this;
                                me.up('form').getForm().reset();
                                me.up('window').close();
                            }
                        }
                    ]
                }
            ]    
        });

        me.callParent(arguments);
    },
});