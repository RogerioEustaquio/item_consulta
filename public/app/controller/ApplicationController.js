Ext.define('App.controller.ApplicationController', {
    extend: 'Ext.app.Controller',

    requires: [
        'App.view.pvsolicitacao.Main',
        'App.view.pvsolicitacaocadastro.Main'
    ],

    control: {
        // '#mastermenu > menuitem': {
        //     click: function(item){
        //         console.log(item)
        //     }
        // }
    },
    
    getViewport: function(){
        return App.getApplication().getMainView();
    },
    
    addOrActiveCard: function(xtype){
        var viewport = this.getViewport(),
            viewportCard = viewport.down('#applicationcard');
        
        var page = viewportCard.down(xtype);
        if(!page){
            page = viewportCard.add({ xtype: xtype });
        }
        
        viewportCard.setActiveItem(page);
    },
    
    routes: {
        'login': { action: 'loginAction' },
        'pvsolicitacaoalteracao': { action: 'pvsolicitacaoalteracaoAction' },
        'pvsolicitacaocadastro': { action: 'pvsolicitacaocadastroAction' }
    },
    
    init: function() {
        var me = this;

        App.app.on('menumasterclick', function(item){
            me.redirectTo(item);
        });

        me.mainAction();
    },
    
    mainAction: function(){
        var me = this,
            viewport = me.getViewport();
        
        // Adiciona a toolbar
        // viewport.add({
        //     region: 'north',
        //     xtype: 'toolbarheader'
        // });
        
        // Adiciona o card
        viewport.add({
            itemId: 'applicationtabs',
            region: 'center',
            xtype: 'tabpanel',
            layout: 'fit'
        });
    },
    
    pvsolicitacaoalteracaoAction: function(){
        var me = this,
            viewport = me.getViewport(),
            viewportTabs = viewport.down('#applicationtabs'),
            xtype = 'pvsolicitacaoalteracaomain',
            tab = viewportTabs.down(xtype);

            console.log(xtype)
            console.log(tab)
            
        if(!tab){
            tab = viewportTabs.add({
                closable: true,
                xtype: xtype,
                listeners: {
                    destroy: function(){
                        me.redirectTo('home');
                    }
                }
            });
        };
        
        viewportTabs.setActiveItem(tab);
    },

    pvsolicitacaocadastroAction: function(){
        var me = this,
            viewport = me.getViewport(),
            viewportTabs = viewport.down('#applicationtabs'),
            xtype = 'pvsolicitacaocadastromain',
            tab = viewportTabs.down(xtype);

            console.log(xtype)
            console.log(tab)

        if(!tab){
            tab = viewportTabs.add({
                closable: true,
                xtype: xtype,
                listeners: {
                    destroy: function(){
                        me.redirectTo('home');
                    }
                }
            });
        };
        
        viewportTabs.setActiveItem(tab);
    }
    
});
