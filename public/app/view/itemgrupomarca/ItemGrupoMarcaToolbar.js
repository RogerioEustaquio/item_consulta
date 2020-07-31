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
                    var pestoque  = form.up('toolbar').down('#bxestoque').getValue();
                    var dtinicio = form.up('toolbar').down('#dtinicio').getRawValue();
                    var dtfinal  = form.up('toolbar').down('#dtfim').getRawValue();
                    var dtiniciov = form.up('toolbar').down('#dtiniciov').getRawValue();
                    var dtfinalv  = form.up('toolbar').down('#dtfimv').getRawValue();
                    
                    var storegrupo = me.up('container').down('#containergrids').down('#grupomarcagridpanel').down('grid').getStore();
                    var storemarca = me.up('container').down('#containergrids').down('#marcagridpanel').down('grid').getStore();
                    var storeitem = me.up('container').down('#containergrids').down('#itemgridpanel').down('grid').getStore();

                    var params = {
                        emp: valor,
                        produto: txtProduto,
                        estoque: pestoque,
                        dtinicio: dtinicio,
                        dtfinal: dtfinal,
                        dtiniciov: dtiniciov,
                        dtfinalv: dtfinalv
                    };

                    storegrupo.getProxy().setExtraParams(params);
                    storemarca.getProxy().setExtraParams(params);
                    storeitem.getProxy().setExtraParams(params);

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

        var dtiniciov = Ext.create('Ext.form.field.Date',{
            name: 'dtiniciov',
            id: 'dtiniciov',
            fieldLabel: 'Venda de',
            margin: '2 2 2 12',
            width: 172,
            labelWidth: 60,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var dtfimv = Ext.create('Ext.form.field.Date',{
            name: 'dtfimv',
            id: 'dtfimv',
            fieldLabel: 'até',
            margin: '2 2 2 2',
            width: 132,
            labelWidth: 20,
            format: 'd/m/Y',
            altFormats: 'dmY',
            emptyText: '__/__/____'
        });

        var bxestoque = Ext.create('Ext.form.field.ComboBox',{
            name: 'Estoque',
            id: 'bxestoque',
            // fieldLabel: 'Estoque',
            emptyText: 'Estoque',
            width: 100,
            margin: '2 2 2 2',
            store: Ext.create('Ext.data.Store', {
                        fields: ['estoque', 'name'],
                        data : [
                            {"estoque":"", "name":"Todos"},
                            {"estoque":"S", "name":"Disponível"},
                            {"estoque":"N", "name":"Zerado"},
                            ]
                    }),
            queryMode: 'local',
            queryParam: 'Estoque',
            displayField: 'name',
            valueField: 'estoque'
            
        });

        var btnSearch = Ext.create('Ext.button.Button',{
            
            iconCls: 'fa fa-search',
            tooltip: 'Consultar',
            margin: '1 1 1 1',
            handler: function(form) {

                var emp  = form.up('toolbar').down('#cbxempgrupo').getValue();
                var produto   = form.up('toolbar').down('#txtproduto').getValue();
                var pestoque  = form.up('toolbar').down('#bxestoque').getValue();
                var dtinicio  = form.up('toolbar').down('#dtinicio').getRawValue();
                var dtfinal   = form.up('toolbar').down('#dtfim').getRawValue();
                var dtiniciov = form.up('toolbar').down('#dtiniciov').getRawValue();
                var dtfinalv  = form.up('toolbar').down('#dtfimv').getRawValue();

                var storegrupo = me.up('container').down('#containergrids').down('#grupomarcagridpanel').down('grid').getStore();
                var storemarca = me.up('container').down('#containergrids').down('#marcagridpanel').down('grid').getStore();
                var storeitem = me.up('container').down('#containergrids').down('#itemgridpanel').down('grid').getStore();

                var params = {
                    emp: emp,
                    produto: produto,
                    estoque: pestoque,
                    dtinicio: dtinicio,
                    dtfinal: dtfinal,
                    dtiniciov: dtiniciov,
                    dtfinalv: dtfinalv
                };

                storegrupo.getProxy().setExtraParams(params);
                storemarca.getProxy().setExtraParams(params);
                storeitem.getProxy().setExtraParams(params);
                
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
                var pestoque  = form.up('toolbar').down('#bxestoque');
                var pdtinicio = form.up('toolbar').down('#dtinicio');
                var pdtfinal  = form.up('toolbar').down('#dtfim');
                var pdtiniciov = form.up('toolbar').down('#dtiniciov');
                var pdtfinalv  = form.up('toolbar').down('#dtfimv');

                pproduto.setValue('');
                pestoque.select(null);
                pdtinicio.setRawValue('');
                pdtfinal.setRawValue('');
                pdtiniciov.setRawValue('');
                pdtfinalv.setRawValue('');

                var storegrupo = me.up('container').down('#containergrids').down('#grupomarcagridpanel').down('grid').getStore();
                var storemarca = me.up('container').down('#containergrids').down('#marcagridpanel').down('grid').getStore();
                var storeitem = me.up('container').down('#containergrids').down('#itemgridpanel').down('grid').getStore();

                pemp.getStore().load(
                    function(){

                        pemp.select(USUARIO.empresa);

                        var params = {
                            emp: USUARIO.empresa,
                            produto: '',
                            estoque: '',
                            dtinicio: '',
                            dtfinal: '',
                            dtiniciov: '',
                            dtfinalv: ''
                        };

                        storegrupo.getProxy().setExtraParams(params);
                        storemarca.getProxy().setExtraParams(params);
                        storeitem.getProxy().setExtraParams(params);

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
                bxestoque,
                dtinicio,
                dtfim,
                dtiniciov,
                dtfimv,
                btnSearch,
                btnClean
            ]

        });

        me.callParent(arguments);

    }

});
