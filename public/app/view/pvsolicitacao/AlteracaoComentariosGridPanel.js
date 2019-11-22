Ext.define('App.view.pvsolicitacao.AlteracaoComentariosGridPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'pvsolicitacaoalteracaocomentariosgridpanel',

    requires: [
        'App.view.pvsolicitacao.AlteracaoComentariosGridPanelController'
    ],

    controller: 'pvsolicitacaoalteracaocomentarios',

    title: 'Comentários',
    hideHeaders: true,

    constructor: function(config) {
        var me = this,
            utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.model.pvsolicitacao.AlteracaoComentarios', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'usuario',  type: 'string' },
                { name: 'mensagem',  type: 'string' },
                { name: 'data', type: 'date', dateFormat: 'd/m/Y H:i:s' }
            ]
        });
    
        Ext.applyIf(me, {
            store: Ext.create('Ext.data.Store', {
                model: 'App.model.pvsolicitacao.AlteracaoComentarios',
                pageSize: 50,
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/pvsolicitacao/listarcomentarios',
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

            // plugins: {
            //     rowexpander: {
            //         rowBodyTpl: new Ext.XTemplate(
            //             '<p><b>Company:</b> {name}</p>',
            //             '<p><b>Change:</b> {change:this.formatChange}</p><br>',
            //             '<p><b>Summary:</b> {desc}</p>',
            //             {
            //                 formatChange: function(v) {
            //                     var color = v >= 0 ? 'green' : 'red';
        
            //                     return '<span style="color: ' + color + ';">' +
            //                         Ext.util.Format.usMoney(v) + '</span>';
            //                 }
            //             })
            //     }
            // }

            // plugins: [{
            //     ptype: 'ux-rowexpander',
            //     id: 'rowexpander'
            // }]

            // viewConfig: {
            //     itemId: 'view',
            //     plugins: [{
            //         pluginId: 'preview',
            //         ptype: 'preview',
            //         bodyField: 'menagem',
            //         expanded: true
            //     }]
            // }
        });

        me.callParent(arguments);
    }
});