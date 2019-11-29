Ext.define('App.view.pvanalise.MainWindow', {
    extend: 'Ext.window.Window',
    xtype: 'pvanalisemain',

    title: 'Análise de Preço',
    width: Ext.getBody().getWidth() * 0.9,
    height: Ext.getBody().getHeight() * 0.8,
    // minHeight: 400,
    layout: 'fit',
    modal: true,
    empresa: null,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
                
        });

        me.callParent(arguments);
    },
});