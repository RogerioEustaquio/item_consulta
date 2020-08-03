Ext.define('App.view.itemgrupomarca.filtroPanel', {
    extend: 'Ext.container.Container',
    xtype: 'filtroPanel',
    id: 'filtroPanel',
    width: 200,
    layout: 'fit',
    region: 'rigth',
    constructor: function() {
        var me = this;

        var btngrupo = Ext.create('');

        Ext.applyIf(me, {

            items: [
                {
                    xtype: 'form',
                    title: 'Filtro',
                    defaultType: 'textfield',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [
                        {
                            xtype: 'checkboxfield',
                            name : 'grupo',
                            checked: true,
                            fieldLabel: 'Grupo',
                            margin: '2 2 2 2',
                            labelWidth: 40,
                            labelTextAlign: 'right'
                        },
                        {
                            xtype:'checkboxfield',
                            name : 'marca',
                            checked: true,
                            fieldLabel: 'Marca',
                            margin: '2 2 2 2',
                            labelWidth: 40,
                            labelTextAlign: 'right'
        
                        }
                
                    ]
                }
            ]
            

        });

        me.callParent(arguments);
    }

});
