Ext.define('App.model.SolicitacaoAlteracao', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'emp',  type: 'string' },
        { name: 'codItem',  type: 'string' },
        { name: 'descricao',  type: 'string' },
        { name: 'marca',  type: 'string' },
        { name: 'precoDe',  type: 'number' },
        { name: 'precoPara',  type: 'number' },
        { name: 'idSolicitacaoStatus',  type: 'integer' },
        { name: 'status',  type: 'string' },
        { name: 'usuarioSolicitacao',  type: 'string' },
        { name: 'dataSolicitacao', type: 'date', dateFormat: 'd/m/Y H:i:s' }
    ]
});