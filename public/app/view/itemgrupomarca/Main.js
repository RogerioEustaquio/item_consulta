Ext.define('App.view.itemgrupomarca.Main', {
    extend: 'Ext.container.Container',
    xtype: 'itemgrupomarcamain',
    id: 'itemgrupomarcamain',
    itemId: 'itemgrupomarcamain',
    requires: [
    ],
    title: 'Novos Produtos',
    layout: 'border',

    constructor: function() {
        var me = this;
        
        Ext.applyIf(me, {
            style: {
                background:'#ffffff !important'
            },
            items: [
                { 
                    xtype: 'ItemGrupoMarcaToolbar',
                    region: 'north',
                },
                {
                    xtype: 'container',
                    id: 'containergrids',
                    region: 'center',
                    layout: {
                        type: 'hbox'
                    },
                    defaults:{
                        border: false,
                        margin: '1 1 1 1',
                        // scrollable: true,
                        height : '100%',
                    },
                    items:[
                        {
                            // xtype: 'grupomarcagrid',
                            xtype:'panel',
                            id: 'grupomarcagridpanel',
                            layout: 'fit',
                            width: 240,
                            items: [
                                {
                                    xtype: 'GrupoMarcaGrid'
                                }
                            ]
                            
                        },
                        {
                            // xtype: 'marcagrid',
                            xtype:'panel',
                            id: 'marcagridpanel',
                            layout: 'fit',
                            width: 240,
                            items: [
                                {
                                    xtype: 'MarcaGrid'
                                }
                            ]
                        },
                        {
                            // xtype: 'itemgrid',
                            xtype:'panel',
                            id: 'itemgridpanel',
                            layout: 'fit',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'ItemGrid'
                                }
                            ]                               
                        }
                    ]
                }
            ]

        });

        me.callParent(arguments);
    }
    
});
