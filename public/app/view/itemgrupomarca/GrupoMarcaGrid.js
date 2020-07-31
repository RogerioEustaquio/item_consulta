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
        
        var toolbar = this.up('panel').up('container').up('container').down('toolbar');

        var pemp      = toolbar.down('#cbxempgrupo').getRawValue();
        var produto   = toolbar.down('#txtproduto').getValue();
        var pestoque  = toolbar.down('#bxestoque').getValue();
        var dtinicio  = toolbar.down('#dtinicio').getRawValue();
        var dtfinal   = toolbar.down('#dtfim').getRawValue();
        var dtiniciov = toolbar.down('#dtiniciov').getRawValue();
        var dtfinalv  = toolbar.down('#dtfimv').getRawValue();

        var params = {
            emp: pemp,
            produto: produto,
            estoque: pestoque,
            dtinicio: dtinicio,
            dtfinal: dtfinal,
            dtiniciov: dtiniciov,
            dtfinalv: dtfinalv,
            grupoMarca: stringGrupo
        };

        var gridmarca = this.up('panel').up('container').down('#marcagridpanel').down('grid').getStore();
        gridmarca.getProxy().setExtraParams(params);
        
        var griditem = this.up('panel').up('container').down('#itemgridpanel').down('grid').getStore();
        griditem.getProxy().setExtraParams(params);

        gridmarca.load(
            function(){
                griditem.loadPage(1);
            }
        );
        
    }

});
