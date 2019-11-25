Ext.define('App.view.Viewport', {
    extend: 'Ext.Viewport',
    requires: [
        
    ],
    
    layout: 'border',

    items: [
        {
            region: 'north',
            xtype: 'toolbar',
            padding: 2,
            items: [
                {
                    iconCls: 'fa fa-bars',
                    itemId: 'mastermenu',
                    menu: [
                        {
                            xtype: 'displayfield',
                            value: '<b>Solicitação de Precificação</b>'
                        },
                        { 
                            text: 'Alteração de Preço',
                            name: 'pvsolicitacaoalteracao',
                            handler: function(){
                                console.log('click')
                                App.app.fireEvent('menumasterclick', 'pvsolicitacaoalteracao');
                            }
                        },
                        { 
                            text: 'Cadastro de Preço',
                            name: 'pvsolicitacaocadastro',
                            handler: function(){
                                console.log('click')
                                App.app.fireEvent('menumasterclick', 'pvsolicitacaocadastro');
                            }
                        },
                        '-'
                    ]
                }
            ]
        }
    ]

});