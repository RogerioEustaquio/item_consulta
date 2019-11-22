Ext.define('App.view.pvsolicitacao.AlteracaoComentariosGridPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'pvsolicitacaoalteracaocomentariosgridpanel',

    requires: [
        'App.view.pvsolicitacao.AlteracaoComentariosGridPanelController'
    ],

    controller: 'pvsolicitacaoalteracaocomentarios',

    title: 'Comentários',

    constructor: function(config) {
        var me = this,
            utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.model.pvsolicitacao.AlteracaoComentarios', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'emp',  type: 'string' },
                { name: 'codItem',  type: 'string' }
            ]
        });
    
        Ext.applyIf(me, {
            store: Ext.create('Ext.data.Store', {
                model: 'App.model.pvsolicitacao.AlteracaoComentarios',
                pageSize: 50,
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
                }
            ]
        });

        me.callParent(arguments);
    }
});