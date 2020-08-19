Ext.define('App.view.itemgrupomarca.filtroPanel', {
    extend: 'Ext.container.Container',
    xtype: 'filtroPanel',
    id: 'filtroPanel',
    width: 200,
    layout: 'fit',
    region: 'rigth',
    constructor: function() {
        var me = this;

        Ext.applyIf(me, {

            items: [
                {
                    xtype: 'form',
                    title: 'Filtro',
                    defaultType: 'textfield',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [
                        {
                            xtype: 'checkboxfield',
                            id : 'grupo',
                            checked: true,
                            fieldLabel: 'Grupo',
                            margin: '2 2 2 2',
                            labelWidth: 40,
                            labelTextAlign: 'right'
                        },
                        {
                            xtype:'checkboxfield',
                            id : 'marca',
                            checked: true,
                            fieldLabel: 'Marca',
                            margin: '2 2 2 2',
                            labelWidth: 40,
                            labelTextAlign: 'right'
        
                        },
                        {
                            xtype: 'button',
                            text: 'Salvar',
                            name: 'salvar',
                            handler: function(){
                                var form = this.up('form');

                                var ckgrupo = form.down('#grupo');
                                var ckmarca = form.down('#marca');

                                var grids = Ext.getCmp('containergrids');
                                var gridGrupo = grids.down('#grupomarcagridpanel');
                                var gridMarca = grids.down('#marcagridpanel') ;

                                console.log(gridGrupo);

                                if(ckgrupo.checked == false){
                                    gridGrupo.setHidden(true);
                                }else{
                                    gridGrupo.setHidden(false);
                                }

                                if(ckmarca.checked == false){
                                    gridMarca.setHidden(true);
                                }else{
                                    gridMarca.setHidden(false);
                                }
                            }
                        }

                    ]
                }
            ]
            

        });

        me.callParent(arguments);
    }

});
