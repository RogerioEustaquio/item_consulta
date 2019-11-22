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

    items: [
        {
            xtype: 'form',
            bodyPadding: '5 5 5 5',
            defaults: {
                labelStyle: 'font-weight: bold;',
                anchor: '100%'
            },
            items: [

                {
                    xtype: 'hiddenfield',
                    name: 'emp',
                    value: 'RE'
                },

                {   
                    fieldLabel: 'Emp', xtype: 'displayfield', name: 'displayemp', value: 'RE' 
                },

                {
                    fieldLabel: 'Produto', 
                    xtype: 'combobox',
                    name: 'produto',
                    store: Ext.data.Store({
                        fields: [{ name: 'coditem' }, { name: 'descricao' }],
                        proxy: {
                            type: 'ajax',
                            url: BASEURL + '/api/precosolicitacao/listarprodutos',
                            reader: { type: 'json', root: 'data' },
                            extraParams: {
                                emp: 'RE'
                            }
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
                            // console.log(record.get('preco'))
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

                // {
                //     xtype: 'fieldset',
                //     // title: 'Contact Information',
                //     defaultType: 'textfield',
                //     layout: 'anchor',
                //     defaults: {
                //         anchor: '100%',
                //         componentCls: ""
                //     },
                //     items: [{
                //         xtype: 'fieldcontainer',
                //         fieldLabel: 'Preço',
                //         // labelWidth: 110,
                //         layout: 'hbox',
                //         combineErrors: true,
                //         defaultType: 'textfield',
                //         defaults: {
                //             hideLabel: 'true'
                //         },
                //         border: false,
                //         items: [
                //             {
                //                 fieldLabel: 'First Name',
                //                 name: 'firstName',
                //                 flex: 2,
                //                 emptyText: 'Atual',
                //                 allowBlank: false
                //             }, 
                //             {
                //                 fieldLabel: 'Last Name',
                //                 name: 'lastName',
                //                 flex: 3,
                //                 margin: '0 0 0 6',
                //                 emptyText: 'Ideal',
                //                 allowBlank: false
                //             }
                //         ]
                //     }]
                // },

                {   
                    fieldLabel: 'Preço Atual', xtype: 'displayfield', name: 'precoatual', value: '' 
                },

                {
                    allowBlank: false, 
                    inputType: 'numberfield', 
                    xtype: 'numberfield', 
                    minValue: 0, 
                    width: 120,
                    decimalSeparator: ',', 
                    fieldLabel: 'Preço Ideal', 
                    name: 'preco', 
                    emptyText: 'Informe o preço ideal'
                },
                
                {
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
                        
                        me.up('window').setLoading({msg: '<b>Salvando os dados...</b>'});

                        Ext.Ajax.request({
                            url: BASEURL +'/api/precosolicitacao/enviarsolicitacao',
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
                                App.app.fireEvent('solicitacaoalteracaoenviada', values);

                            }
                        });
                    }
                }, 
                {
                    text: 'Cancelar',
                    action: 'cancelar',
                    handler: function() {
                        
                    }
                }
            ]
        }
    ]
    
});