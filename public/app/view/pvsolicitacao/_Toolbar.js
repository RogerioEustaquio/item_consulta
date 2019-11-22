Ext.define('App.view.SolicitacaoToolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'solicitacaotoolbar',

    items: [
        {
            text: 'Toggle docked',
            handler: function() {
                var toolbar = Ext.ComponentQuery.query('toolbar')[0],
                    newDocked = (toolbar.getDocked() === 'top') ? 'bottom' : 'top';

                toolbar.setDocked(newDocked);
            }
        }
    ]
});