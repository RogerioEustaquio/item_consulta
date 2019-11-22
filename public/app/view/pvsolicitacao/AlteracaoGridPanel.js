Ext.define('App.view.pvsolicitacao.AlteracaoGridPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'pvsolicitacaoalteracaogridpanel',

    requires: [
        'App.view.pvsolicitacao.AlteracaoGridPanelController'
    ],

    controller: 'pvsolicitacaoalteracao',

    title: 'Alteração de Preço',

    tbar: {
        items: [
            {
                xtype: 'toolbar',
                ui: 'footer',
                padding: 0,
                items: [
                    {
                        tooltip: 'Nova Solicitação',
                        iconCls: 'fa fa-plus',
                        handler: function(btn){
                            var win = Ext.create('App.view.pvsolicitacao.AlteracaoWindow');
                            win.show();
                        }
                    },
                    {
                        disabled: true,
                        tooltip: 'Alterar Solicitação',
                        iconCls: 'fa fa-pencil-alt',
                        handler: function(btn){
                            
                        }
                    }
                ]
            }
        ]
    },

    constructor: function(config) {
        var me = this,
            utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.model.pvsolicitacao.SolicitacaoAlteracao', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'emp',  type: 'string' },
                { name: 'codItem',  type: 'string' },
                { name: 'descricao',  type: 'string' },
                { name: 'marca',  type: 'string' },
                { name: 'precoDe',  type: 'number' },
                { name: 'precoPara',  type: 'number' },
                { name: 'idSolicitacaoStatus',  type: 'integer' },
                { name: 'status',  type: 'string' },
                { name: 'usuarioSolicitacao',  type: 'string' },
                { name: 'dataSolicitacao', type: 'date', dateFormat: 'd/m/Y H:i:s' }
            ]
        });
    
        Ext.applyIf(me, {
            store: Ext.create('Ext.data.Store', {
                model: 'App.model.pvsolicitacao.SolicitacaoAlteracao',
                pageSize: 50,
                // remoteSort: true,
                // sorters: [{ property: 'vendaM6', direction: 'DESC' }],
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/pvsolicitacao/listarsolicitacoes',
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
                    dataIndex: 'codigo'
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
                    text: 'De',
                    width: 110,
                    dataIndex: 'precoDe',
                    renderer: function (v) { return utilFormat.Value(v); }
                },
        
                {
                    text: 'Para',
                    width: 110,
                    dataIndex: 'precoPara',
                    renderer: function (v) { return utilFormat.Value(v); }
                },
        
                {
                    text: 'Status',
                    width: 140,
                    dataIndex: 'status'
                }
            ]
        });

        me.callParent(arguments);
    }
});