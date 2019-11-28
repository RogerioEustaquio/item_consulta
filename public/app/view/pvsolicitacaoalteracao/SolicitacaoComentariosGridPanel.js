Ext.define('App.view.pvsolicitacaoalteracao.SolicitacaoComentariosGridPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'pvsolicitacaoalteracaosolicitacaocomentariosgridpanel',
    controller: 'pvsolicitacaoalteracaosolicitacaocomentarios',

    title: 'Comentários',
    hideHeaders: true,

    constructor: function(config) {
        var me = this,
            utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.model.pvsolicitacaoalteracao.SolicitacaoComentario', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'usuario',  type: 'string' },
                { name: 'mensagem',  type: 'string' },
                { name: 'data', type: 'date', dateFormat: 'd/m/Y H:i:s' }
            ]
        });
    
        Ext.applyIf(me, {
            store: Ext.create('Ext.data.Store', {
                model: 'App.model.pvsolicitacaoalteracao.SolicitacaoComentario',
                pageSize: 50,
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/pvsolicitacaoalteracao/listarcomentarios',
                    timeout: 120000,
                    reader: { type: 'json', root: 'data' }
                }
            }),
            
            // header: false,

            columns: [
                {
                    
                    text: 'Usuario',
                    flex: 1,
                    dataIndex: 'usuario',
                    renderer: function(v) {
                        return '<b>' + v + '</b>';
                    }
                }, 
        
                {
                    menuDisabled: true,
                    text: 'Data',
                    width: 130,
                    dataIndex: 'data',
                    renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
                }
            ],

            features: [{
                ftype: 'rowbody',
                getAdditionalData: function (data, idx, record, orig) {
                    return {
                        rowBody: '<span>' + record.get("mensagem") + '</span>',
                        rowBodyCls: "grid-body-cls"
                    };
                }
            }]
        });

        me.callParent(arguments);
    }
});