Ext.define('App.view.pvsolicitacaoalteracao.AnaliseWindow', {
    extend: 'Ext.window.Window',
    xtype: 'pvsolicitacaoalteracaoanalisewindow',

    title: 'Análise de Preço',
    width: Ext.getBody().getWidth() * 0.9,
    height: Ext.getBody().getHeight() * 0.6,
    
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
                    width: 280,
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
                { name: 'lucroUnitario',  type: 'number' },
                { name: 'descontoLetra',  type: 'string' },
                { name: 'descontoPerc',  type: 'number' },
                { name: 'mb',  type: 'number' },
                
                // { name: 'preco',  type: 'number' },
                // { name: 'preco',  type: 'number' },
                // { name: 'preco',  type: 'number' },
                // { name: 'preco',  type: 'number' },
                // { name: 'preco',  type: 'number' },
                // { name: 'preco',  type: 'number' },
                
            ]
        });
        
        var cmp = {
            xtype: 'gridpanel',
            store: Ext.create('Ext.data.Store', {
                model: 'App.model.pvsolicitacaoalteracao.Simulacao',
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/pvsolicitacaoalteracao/simularpreco',
                    timeout: 120000,
                    reader: { type: 'json', root: 'data' },
                    extraParams: {
                        teste: 1
                    }
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
                    text: 'Markup',
                    align: 'right',
                    width: 90,
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
                    hidden: true,
                    text: 'Lb Unit.',
                    align: 'right',
                    width: 90,
                    dataIndex: 'lucroUnitario',
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
                    dataIndex: 'mb',
                    renderer: function (v) { return utilFormat.Value(v); }
                },

                {
                    text: 'Com Alteração',
                    columns: [
                        {
                            text: 'Preço',
                            align: 'right',
                            width: 80,
                            dataIndex: 'preco',
                            renderer: function (v) { return utilFormat.Value(v); }
                        },
        
                        {
                            hidden: true,
                            text: 'Lb Unit.',
                            align: 'right',
                            width: 90,
                            dataIndex: 'lucroUnitario',
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
                            text: 'Mb Mín',
                            align: 'center',
                            width: 70,
                            dataIndex: 'mb',
                            renderer: function (v) { return utilFormat.Value(v); }
                        }
                    ]
                }

            ]
        };

        return cmp;
    },

    buildForm: function(){
        var cmp = {
            xtype: 'form',
            bodyPadding: '5 5 5 5',
            defaults: {
                labelAlign: "right",
                labelStyle: 'font-weight: bold;',
                anchor: '100%'
            },
            items: [
               
                {   
                    fieldLabel: 'Preço', 
                    xtype: 'displayfield', 
                    name: 'preco'
                },

                {   
                    fieldLabel: 'Margem', 
                    xtype: 'displayfield', 
                    name: 'margem'
                },

                {   
                    fieldLabel: 'Markup', 
                    xtype: 'displayfield', 
                    name: 'markup'
                },

                {
                    margin: '10 0 0 0',
                    xtype:'textarea',
                    labelAlign: 'top',
                    allowBlank: false,
                    name: 'comentario',
                    emptyText: 'Comentário'
                }
            ],
            buttons: [

                {
                    text: 'Aprovar',
                    action: 'aprovar',
                    formBind: true, 
                    disabled: true,
                    handler: 'onBtnAprovarClick'
                }, 

                {
                    text: 'Alterar',
                    action: 'alterar',
                    formBind: true, 
                    disabled: true,
                    handler: 'onBtnAlterarClick'
                }, 

                {
                    text: 'Reprovar',
                    action: 'reprovar',
                    formBind: true, 
                    disabled: true,
                    handler: 'onBtnReprovarClick'
                }
            ]
        };

        return cmp;
    }

});