Ext.define('App.controller.ApplicationController', {
    extend: 'Ext.app.Controller',

    requires: [
        'App.view.SolicitacaoMain'
    ],
    
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
        'solicitacao': { action: 'solicitacaoAction' }
    },
    
    init: function() {
        var me = this;

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
            itemId: 'applicationcard',
            region: 'center',
            xtype: 'container',
            layout: 'card'
        });
    },
    
    solicitacaoAction: function(){
        var me = this,
            viewport = me.getViewport(),
            viewportCard = viewport.down('#applicationcard'),
            card = viewport.down('#solicitacao');
            
        if(!card){
            card = viewportCard.add({
                xtype: 'solicitacaomain'
            });
        };
        
        viewportCard.setActiveItem(card);
    }
    
});
