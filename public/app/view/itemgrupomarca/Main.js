Ext.define('App.view.itemgrupomarca.Main', {
    extend: 'Ext.container.Container',
    xtype: 'itemgrupomarcamain',
    id: 'itemgrupomarcamain',
    itemId: 'itemgrupomarcamain',
    requires: [
    ],
    title: 'Novos Produtos',
    layout: 'auto',

    constructor: function() {
        var me = this;
        
        Ext.applyIf(me, {
            
            items: [
                { 
                    xtype: 'ItemGrupoMarcaToolbar',
                },
                {
                    xtype: 'container',
                    id: 'containergrids',
                    layout: {
                        type: 'hbox'
                    },
                    defaults:{
                        border: false,
                        margin: '2 2 2 2',
                        // scrollable: true,
                        height : 536,
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