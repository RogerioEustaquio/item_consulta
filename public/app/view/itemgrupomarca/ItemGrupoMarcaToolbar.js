Ext.define('App.view.itemgrupomarca.ItemGrupoMarcaToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'ItemGrupoMarcaToolbar',
    id: 'ItemGrupoMarcaToolbar',
    itemId: 'ItemGrupoMarcaToolbar',
    margin: '2 2 2 2',
    requires: [
    ],
    constructor: function() {
        var me = this;

        var empbx = Ext.create('Ext.form.field.ComboBox',{
            width: 70,
            // name: 'empresa',
            id: 'cbxempgrupo',
            itemId: 'cbxempgrupo',
            store: Ext.data.Store({
                fields: [{ name: 'idEmpresa' }, { name: 'apelido' }],
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/ItemGrupoMarca/listarempresas',
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            queryParam: 'codigo',
            queryMode: 'local',
            displayField: 'nome',
            valueField: 'nome',
            emptyText: 'Emp',
            forceSelection: true,
            disabled: true,
            listeners: {
                select: function (form){
        
                    var valor = form.getRawValue();
                    
                    var storegrupo = me.up('container').down('#containergrids').down('#grupomarcagridpanel').down('grid').getStore();
                    var storemarca = me.up('container').down('#containergrids').down('#marcagridpanel').down('grid').getStore();
                    var storeitem = me.up('container').down('#containergrids').down('#itemgridpanel').down('grid').getStore();

                    storegrupo.getProxy().setExtraParams({emp: valor});
                    storemarca.getProxy().setExtraParams({emp: valor});
                    storeitem.getProxy().setExtraParams({emp: valor});

                    storegrupo.load(function(){
                    
                        storemarca.load(
                            function(){
                                
                                storeitem.load()
                            }
                        );
                    });
                    
                    ;
                }
            }
        });

        empbx.store.load(function(r){
            empbx.enable();
            empbx.select(USUARIO.empresa);

            me.up('container').down('#containergrids').down('#grupomarcagridpanel').down('grid').getStore().load(
                function(){
                    
                    me.up('container').down('#containergrids').down('#marcagridpanel').down('grid').getStore().load(
                        function(){
                            
                            me.up('container').down('#containergrids').down('#itemgridpanel').down('grid').getStore().load();
                        }
                    );
                }
            );

            
           

        });

        Ext.applyIf(me, {
            items: empbx

        });

        me.callParent(arguments);

    }

});