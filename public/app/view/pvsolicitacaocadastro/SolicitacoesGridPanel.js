Ext.define('App.view.pvsolicitacaocadastro.SolicitacoesGridPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'pvsolicitacaocadastrogridpanel',

    requires: [
        'App.view.pvsolicitacaocadastro.SolicitacoesGridPanelController'
    ],

    controller: 'pvsolicitacaocadastrosolicitacoes',

    title: 'Cadastro de Preço',

    tbar: {
        items: [
            {
                // disabled: true,
                tooltip: 'Nova Solicitação',
                iconCls: 'fa fa-plus',
                itemId: 'novasolicitacao',
                handler: 'onBtnNovaSolicitacaoClick'
            },
            {
                disabled: true,
                tooltip: 'Alterar Solicitação',
                iconCls: 'fa fa-pencil-alt',
                itemId: 'alterarsolicitacao',
                handler: 'onBtnAlterarSolicitacaoClick'
            },
            '->',
            {
                width: 70,
                xtype: 'combobox',
                name: 'empresa',
                itemId: 'comboempresa',
                store: Ext.data.Store({
                    fields: [{ name: 'coditem' }, { name: 'descricao' }],
                    proxy: {
                        type: 'ajax',
                        url: BASEURL + '/api/pvsolicitacao/listarempresas',
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
                    select: 'onEmpresaSelect'
                }
            }
        ]
    },

    constructor: function(config) {
        var me = this,
            utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.model.pvsolicitacaocadastro.Solicitacao', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'idSolicitacao',  type: 'integer' },
                { name: 'emp',  type: 'string' },
                { name: 'codItem',  type: 'string' },
                { name: 'descricao',  type: 'string' },
                { name: 'marca',  type: 'string' },
                { name: 'custo',  type: 'number' },
                { name: 'precoSugerido',  type: 'number' },
                { name: 'precoConfirmado',  type: 'number' },
                { name: 'idSolicitacaoStatus',  type: 'integer' },
                { name: 'idStatus',  type: 'integer' },
                { name: 'descricaoStatus',  type: 'string' },
                { name: 'usuarioSolicitacao',  type: 'string' },
                { name: 'dataSolicitacao', type: 'date', dateFormat: 'd/m/Y H:i:s' }
            ]
        });
    
        Ext.applyIf(me, {
            store: Ext.create('Ext.data.Store', {
                model: 'App.model.pvsolicitacaocadastro.Solicitacao',
                pageSize: 50,
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/pvsolicitacaocadastro/listarsolicitacoes',
                    timeout: 120000,
                    reader: { type: 'json', root: 'data' }
                }
            }),
        
            columns: [
                {
                    text: 'Emp',
                    width: 52,
                    dataIndex: 'emp'
                }, 
        
                {
                    text: 'Código',
                    width: 120,
                    dataIndex: 'codItem'
                }, 
        
                {
                    text: 'Descrição',
                    minWidth: 320,
                    flex: 1,
                    dataIndex: 'descricao'
                }, 
        
                {
                    text: 'Marca',
                    width: 180,
                    dataIndex: 'marca'
                }, 
        
                {
                    text: 'Data',
                    width: 125,
                    align: 'center',
                    dataIndex: 'dataSolicitacao',
                    renderer: Ext.util.Format.dateRenderer('d/m/Y H:i')
                },
                
                {
                    text: 'Custo',
                    align: 'right',
                    width: 110,
                    dataIndex: 'custo',
                    renderer: function (v) { 
                        if(v)
                        return utilFormat.Value(v); 
                    }
                },

                {
                    text: 'Preço Sugerido',
                    align: 'right',
                    width: 150,
                    dataIndex: 'precoSugerido',
                    renderer: function (v) { 
                        if(v)
                        return utilFormat.Value(v); 
                    }
                },

                {
                    text: 'Preço Confirmado',
                    align: 'right',
                    width: 150,
                    dataIndex: 'precoConfirmado',
                    renderer: function (v) { 
                        if(v)
                        return utilFormat.Value(v);     
                    }
                },

                {
                    text: 'Status',
                    width: 86,
                    dataIndex: 'descricaoStatus',
                    renderer: function (value, metaData, record) {
                        var idStatus = record.get('idStatus');

                        if (idStatus === 1)
                            metaData.tdCls = 'x-grid-cell-green-border';
                            
                        return value;
                    }
                }

            ]
        });

        me.callParent(arguments);
    }
});