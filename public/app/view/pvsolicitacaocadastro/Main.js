Ext.define('App.view.pvsolicitacaocadastro.Main', {
    extend: 'Ext.Container',
    xtype: 'pvsolicitacaocadastromain',
    requires: [
        
    ],

    // controller: 'pvsolicitacaocadastrosolicitacoes',
    
    title: 'Cadastro de Preço',

    layout: 'border',
    items: [
        {   
            region: 'center',
            xtype: 'pvsolicitacaocadastrogridpanel',
            title: null
        },
        {
            region: 'south',
            xtype: 'tabpanel',
            height: 180,
            items: [
                {
                    title: 'Comentário',
                    layout: 'fit',
                    itemId: 'comentario',
                    items: [
                        { 
                            xtype: 'displayfield'
                        }
                    ]
                }
            ]
        }
    ]
});