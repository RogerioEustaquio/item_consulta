Ext.define('App.controller.ApplicationController', {
    extend: 'Ext.app.Controller',

    requires: [
        
    ],

    control: {
        // '#mastermenu > menuitem': {
        //     click: function(item){
        //         console.log(item)
        //     }
        // }
    },

    routes: {
        'home': { action: 'pvvaloresprodutoAction' },
        'transferencia': { action: 'pvtransfprodutoAction' }
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
    
    init: function() {
        var me = this;

        App.app.on('menumasterclick', function(item){
            me.redirectTo(item);
        });

        // Se não tiver logado
        me.mainAction();
    },
    
    mainAction: function(){
        var me = this,
            viewport = me.getViewport();
        
        if(viewport){
            viewport.add({
                itemId: 'applicationtabs',
                region: 'center',
                xtype: 'tabpanel',
                layout: 'fit'
            });
        }
    },

    homeAction: function(){
        var me = this,
        viewport = me.getViewport();
    },
    
    pvvaloresprodutoAction: function(){
        var me = this;
        me.rmTranfTab();
        me.addMasterTab('pvvaloresprodutomain');
        me.rmTranfTab();
        me.addMasterTab('itemgrupomarcamain');
        me.rmTranfTab();
        
    },

    pvtransfprodutoAction: function(){
        var me = this;
        me.rmAllTab('transfprodutomain');
        me.addMasterTab('pvtransfprodutomain');
        me.rmAllTab('transfprodutomain');
    },

    rmTranfTab: function(){
        var me = this,
            viewport = me.getViewport(),
            viewportTabs = viewport.down('#applicationtabs');

        viewportTabs.remove('transfprodutomain');

    },

    rmAllTab: function(key){
        var me = this,
            viewport = me.getViewport(),
            viewportTabs = viewport.down('#applicationtabs');

            var idtabs = viewportTabs.items.keys;

            for (let index = 0; index < idtabs.length; index++) {
                var element = idtabs[index];

                if(key != element){
                    viewportTabs.remove(element);
                }
            }

    },

    addMasterTab: function(xtype){
        var me = this,
            viewport = me.getViewport(),
            viewportTabs = viewport.down('#applicationtabs'),
            tab = viewportTabs.down(xtype);

        if(!tab){

            tab = viewportTabs.add({
                closable: false,
                xtype: xtype,
                listeners: {
                    // destroy: function(){
                    //     me.redirectTo('home');
                    // }
                }
            });
        };
        
        viewportTabs.setActiveItem(tab);
    }
    
});
