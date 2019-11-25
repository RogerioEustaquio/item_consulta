Ext.define('App.view.pvsolicitacao.AlteracaoWindow', {
    extend: 'Ext.window.Window',
    xtype: 'pvsolicitacaoalteracaowindow',
    requires: [
        
    ],

    title: 'Nova solicitação',
    width: 600,
    // height: Ext.getBody().getHeight() * 0.6,
    // minHeight: 400,
    layout: 'fit',
    modal: true,
    empresa: null,

    // referência inicial de criação da janela
    btnRef: null,

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
                            xtype: 'combobox',
                            name: 'produto',
                            store: Ext.data.Store({
                                fields: [{ name: 'coditem' }, { name: 'descricao' }],
                                proxy: {
                                    type: 'ajax',
                                    url: BASEURL + '/api/pvsolicitacao/listarprodutos',
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
                                select: function ( combo, record, ) {
                                    this.up('form').down('displayfield[name=precoatual]').setValue(record.get('preco'))
                                }
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
                            fieldLabel: 'Preço Atual', 
                            xtype: 'displayfield', 
                            name: 'precoatual', 
                            // labelWidth: 80,
                            width: 160,
                            value: '' 
                        },
        
                        {
                            allowBlank: false, 
                            inputType: 'numberfield', 
                            xtype: 'numberfield', 
                            minValue: 0, 
                            width: 220,
                            // labelWidth: 80,
                            decimalSeparator: ',', 
                            fieldLabel: 'Preço Ideal', 
                            name: 'preco',
                            listeners: {
                                mousedown: function(field){
                                    //console.log(field)
                                }
                            }
                        },
        
                        {
                            margin: '10 0 0 0',
                            xtype:'textarea',
                            labelAlign: 'top',
                            // fieldLabel: 'Comentário',
                            allowBlank: false,
                            name: 'comentario',
                            emptyText: 'Informe o motivo da solicitação'
                        }
                    ],
                    buttons: [
                        {
                            text: 'Confirmar',
                            action: 'confirmar',
                            formBind: true, 
                            disabled: true,
                            handler: function() {

                                var me = this,
                                    notyType = 'success',
                                    notyText = 'Solicitação enviada com sucesso!',
                                    values = me.up('form').getForm().getValues();
                                
                                var gridReload = me.up('window').btnRef.up('grid');

                                me.up('window').setLoading({msg: '<b>Salvando os dados...</b>'});
        
                                Ext.Ajax.request({
                                    url: BASEURL +'/api/pvsolicitacao/enviarsolicitacao',
                                    method: 'POST',
                                    params: values,
                                    success: function (response) {
                                        var result = Ext.decode(response.responseText);
                
                                        if(!result.success){
                                            notyType = 'error';
                                            notyText = result.message;
                                        }
                
                                        new Noty({
                                            theme: 'relax',
                                            layout: 'bottomRight',
                                            type: notyType,
                                            timeout: 3000,
                                            text: notyText
                                        }).show();
                
                                        me.up('form').getForm().reset();
                                        me.up('window').close();
        
                                        // Evento de envio
                                        // App.app.fireEvent('pvsolicitacaoalteracaoenviada', values);
                                        gridReload.getStore().reload();
        
                                    }
                                });
                            }
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