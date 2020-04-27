Ext.define('App.view.empresa.empstore', {
    extend: 'Ext.data.Store',
    xtype: 'empstore',
    itemId: 'empsotre',
    fields: [{ name: 'coditem' }, { name: 'descricao' }],
    data: ''
})