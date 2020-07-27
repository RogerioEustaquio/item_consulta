Ext.define('App.view.itemgrupomarca.GrupoMarcaGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'GrupoMarcaGrid',
    store: 'Companies',
    columnLines: true,
    selModel: {
        type: 'checkboxmodel',
    },
    margin: '1 1 1 1',
    store: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model', {
                // fields: ['descricao', 'marca','estoque']
                fields:[{name:'idGrupoMarca',mapping:'idGrupoMarca'},
                        {name:'grupoMarca',mapping:'grupoMarca'},
                        {name:'skus',mapping:'skus'}
                        ]
        }),
        proxy: {
            type: 'ajax',
            method:'POST',
            url : BASEURL + '/api/itemgrupomarca/listargrupomarca',
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
            text: 'Grupo',
            dataIndex: 'grupoMarca',
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

        stringGrupo ='';
        for (let index = 0; index < arraySession.length; index++) {
            var element = arraySession[index];

            if(stringGrupo){
                stringGrupo += ','+element.data.idGrupoMarca;
            }else{
                stringGrupo = element.data.idGrupoMarca;
            }
        }
        
        var pemp = this.up('panel').up('container').up('container').down('toolbar').down('#cbxempgrupo').getRawValue();

        var gridmarca = this.up('panel').up('container').down('#marcagridpanel').down('grid').getStore();
        gridmarca.getProxy().setExtraParams({grupoMarca: stringGrupo, emp: pemp});
        
        var griditem = this.up('panel').up('container').down('#itemgridpanel').down('grid').getStore();
        griditem.getProxy().setExtraParams({grupoMarca: stringGrupo, emp: pemp});

        gridmarca.load(
            function(){
                griditem.loadPage(1);
            }
        );
        
    }

});
