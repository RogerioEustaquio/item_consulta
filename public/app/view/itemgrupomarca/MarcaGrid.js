Ext.define('App.view.itemgrupomarca.MarcaGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'MarcaGrid',
    store: 'Companies',
    columnLines: true,
    selType: 'checkboxmodel',
    margin: '1 1 1 1',
    store: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model', {
                // fields: ['descricao', 'marca','estoque']
                fields:[{name:'idGrupoMarca',mapping:'idGrupoMarca'},
                        {name:'idMarca',mapping:'idMarca'},
                        {name:'marca',mapping:'marca'},
                        {name:'skus',mapping:'skus'}
                        ]
        }),
        proxy: {
            type: 'ajax',
            method:'POST',
            url : BASEURL + '/api/itemgrupomarca/listarmarca',
            encode: true,
            // extraParams: {param1: '0',  param2: ''},
            format: 'json',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        },
        autoLoad : false
    }),
    columns: [
        {
            text: 'Marca',
            dataIndex: 'marca',
            flex: 1
            
        },
        {
            text: 'Itens',
            dataIndex: 'skus',
            width: 60
        }
    ],
    
    listeners: {

        deselect: function() {
            
            this.funcloadgrids();

        },
        select: function() {

            this.funcloadgrids();

        }

    },
    funcloadgrids: function (){
    
        var arraySession = this.getSelection();

        stringMarca ='';
        for (let index = 0; index < arraySession.length; index++) {
            var element = arraySession[index];

            if(stringMarca){
                stringMarca += ','+element.data.idMarca;
            }else{
                stringMarca = element.data.idMarca;
            }
        }

        var gridgrupo = this.up('panel').up('#containergrids').down('#grupomarcagridpanel').down('grid');
        var arraygrupo = gridgrupo.getSelection();

        stringGrupoMarca ='';
        for (let index = 0; index < arraygrupo.length; index++) {
            var element = arraygrupo[index];

            if(stringGrupoMarca){
                
                stringGrupoMarca += ','+element.data.idGrupoMarca;
            }else{
                
                stringGrupoMarca = element.data.idGrupoMarca;
            }
        }

        var pemp = this.up('panel').up('container').up('container').down('toolbar').down('#cbxempgrupo').getRawValue();

        var griditem = this.up('panel').up('container').down('#itemgridpanel').down('grid').getStore();
        griditem.getProxy().setExtraParams({grupoMarca: stringGrupoMarca, marca: stringMarca, emp : pemp});
        griditem.load();
    }

});