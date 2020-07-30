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
            margin: '1 1 1 1',
            listeners: {
                select: function (form){
        
                    var valor = form.getRawValue();

                    var txtProduto = form.up('toolbar').down('#txtproduto').getValue();
                    var dtinicio = form.up('toolbar').down('#dtinicio').getRawValue();
                    var dtfinal  = form.up('toolbar').down('#dtfim').getRawValue();
                    
                    var storegrupo = me.up('container').down('#containergrids').down('#grupomarcagridpanel').down('grid').getStore();
                    var storemarca = me.up('container').down('#containergrids').down('#marcagridpanel').down('grid').getStore();
                    var storeitem = me.up('container').down('#containergrids').down('#itemgridpanel').down('grid').getStore();

                    storegrupo.getProxy().setExtraParams({emp: valor, produto: txtProduto, dtinicio: dtinicio, dtfinal: dtfinal});
                    storemarca.getProxy().setExtraParams({emp: valor, produto: txtProduto, dtinicio: dtinicio, dtfinal: dtfinal});
                    storeitem.getProxy().setExtraParams({emp: valor, produto: txtProduto, dtinicio: dtinicio, dtfinal: dtfinal});

                    storegrupo.load(function(){
                        storemarca.load(
                            function(){
                                storeitem.loadPage(1);
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

            var storegrupo = me.up('container').down('#containergrids').down('#grupomarcagridpanel').down('grid').getStore();
            var storemarca = me.up('container').down('#containergrids').down('#marcagridpanel').down('grid').getStore();
            var storeitem = me.up('container').down('#containergrids').down('#itemgridpanel').down('grid').getStore();

            storegrupo.load(
                function(){
                    storemarca.load(
                        function(){
                            storeitem.loadPage(1);
                        }
                    );
                }
            );
        });

        var btnProd = Ext.create('Ext.form.field.Text',{
            name: 'txtproduto',
            id: 'txtproduto',
            width: 200,
            margin: '1 1 1 1',
            emptyText: 'Código/Descrição do produto',
            enableKeyEvents: true,
            listeners:{

                keyup: function() {
                    var valor = this.getValue();
                    this.setValue(valor.toUpperCase());
                }
            }
        });
        var dtinicio = Ext.create('Ext.form.field.Date',{
            name: 'dtinicio',
            id: 'dtinicio',
            fieldLabel: 'Compra de',
            margin: '2 2 2 12',
            width: 180,
            labelWidth: 68,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var dtfim = Ext.create('Ext.form.field.Date',{
            name: 'dtfim',
            id: 'dtfim',
            fieldLabel: 'até',
            margin: '2 2 2 2',
            width: 132,
            labelWidth: 20,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var btnSearch = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-search',
            tooltip: 'Consulta',
            margin: '1 1 1 1',
            handler: function(form) {

                var emp  = form.up('toolbar').down('#cbxempgrupo').getValue();
                var produto  = form.up('toolbar').down('#txtproduto').getValue();
                var dtinicio = form.up('toolbar').down('#dtinicio').getRawValue();
                var dtfinal  = form.up('toolbar').down('#dtfim').getRawValue();

                var storegrupo = me.up('container').down('#containergrids').down('#grupomarcagridpanel').down('grid').getStore();
                var storemarca = me.up('container').down('#containergrids').down('#marcagridpanel').down('grid').getStore();
                var storeitem = me.up('container').down('#containergrids').down('#itemgridpanel').down('grid').getStore();

                storegrupo.getProxy().setExtraParams({emp: emp, produto: produto, dtinicio: dtinicio, dtfinal: dtfinal});
                storemarca.getProxy().setExtraParams({emp: emp, produto: produto, dtinicio: dtinicio, dtfinal: dtfinal});
                storeitem.getProxy().setExtraParams({emp: emp, produto: produto, dtinicio: dtinicio, dtfinal: dtfinal});
                
                storegrupo.load(
                    function(){
                        storemarca.load(
                            function(){
                                storeitem.loadPage(1);
                            }
                        );
                    }
                );

            }
        });

        var btnClean = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-file',
            tooltip: 'Limpar',
            margin: '1 1 1 4',
            handler: function(form) {

                var pemp  = form.up('toolbar').down('#cbxempgrupo');
                var pproduto  = form.up('toolbar').down('#txtproduto');
                var pdtinicio = form.up('toolbar').down('#dtinicio');
                var pdtfinal  = form.up('toolbar').down('#dtfim');

                pproduto.setValue('');
                pdtinicio.setRawValue('');
                pdtfinal.setRawValue('');

                var storegrupo = me.up('container').down('#containergrids').down('#grupomarcagridpanel').down('grid').getStore();
                var storemarca = me.up('container').down('#containergrids').down('#marcagridpanel').down('grid').getStore();
                var storeitem = me.up('container').down('#containergrids').down('#itemgridpanel').down('grid').getStore();

                pemp.getStore().load(
                    function(){
                        storegrupo.getProxy().setExtraParams({emp: pemp.getValue()});
                        storemarca.getProxy().setExtraParams({emp: pemp.getValue()});
                        storeitem.getProxy().setExtraParams({emp: pemp.getValue()});

                        storegrupo.load(
                            function(){
                                storemarca.load(
                                    function(){
                                        storeitem.loadPage(1);
                                    }
                                );
                            }
                        );
                    }
                );

            }
        });

        Ext.applyIf(me, {

            items: [
                empbx,
                btnProd,
                dtinicio,
                dtfim,
                btnSearch,
                btnClean
            ]

        });

        me.callParent(arguments);

    }

});
