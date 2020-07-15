<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Zend\Db\ResultSet\HydratingResultSet;
use Core\Stdlib\StdClass;
use Core\Hydrator\ObjectProperty;
use Core\Hydrator\Strategy\ValueStrategy;
use Core\Mvc\Controller\AbstractRestfulController;
use Zend\Json\Json;

class TransfProdutoController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }

    public function listarEmpresasAction()
    {
        $data = array();
        
        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $em = $this->getEntityManager();

            $sql = "
                select id_empresa, apelido as nome from ms.empresa 
                where id_matriz = 1 
                and id_empresa = 20
                union all
                select * from (
                    select id_empresa, apelido as nome from ms.empresa 
                    where id_matriz = 1 
                    and id_empresa not in (26, 11, 28, 27, 20)
                    order by apelido
                )
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function listarEmpresaUserAction()
    {
        $data = array();
        
        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $em = $this->getEntityManager();
            

            if($usuario->empresa != "EC"){

                $sql = "select id_empresa, apelido as nome
                            from ms.empresa 
                        where id_matriz = 1 
                        and apelido = '".$usuario->empresa."'
                    ";
            }else{

                $sql = "select id_empresa, apelido as nome
                            from ms.empresa 
                        where id_matriz = 1 
                        and id_empresa = 20
                        union all
                        select * from (
                            select id_empresa, apelido as nome from ms.empresa 
                            where id_matriz = 1 
                            and id_empresa not in (26, 11, 28, 27, 20)
                            order by apelido
                        )
                ";

            }
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function listarProdutosAction()
    {
        $data = array();
        
        try {

            $pEmp = $this->params()->fromQuery('emp',null);
            $pCod = $this->params()->fromQuery('codigo',null);

            if(!$pEmp || !$pCod){
                throw new \Exception('Parâmetros não informados.');
            }

            $em = $this->getEntityManager();
            
            $sql = "select distinct em.apelido as emp,
                            i.cod_item||c.descricao as cod_item,
                            i.descricao,
                            m.descricao as marca, 
                            null as preco_venda,
                            e.custo_contabil,
                            e.id_locacao as locacao,
                            nvl(ace.icms,0) as icms,
                            nvl(ic.aliq_pis,0)+nvl(ic.aliq_cofins,0) as pis_cofins,
                            mg.margem
                        from ms.tb_estoque e,
                             ms.tb_item i,
                             ms.tb_categoria c,
                             ms.tb_item_categoria ic,
                             ms.empresa em,
                             ms.tb_marca m,
                             (SELECT ID_EMPRESA, ID_ITEM, ID_CATEGORIA,
                                    EH_ACESSORIO as acessorio,
                                    GERAR_PRECO_VENDA,
                                    (case when EH_ACESSORIO = 'S' then 17 end) as icms
                             FROM MS.TB_ITEM_CATEGORIA_PARAM
                             ) ace,
                             xtf_param_mb mg
                    where e.id_item = i.id_item
                    and e.id_categoria = c.id_categoria
                    and e.id_empresa = em.id_empresa
                    and e.id_item = ic.id_item
                    and e.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca
                    and e.id_empresa = ace.id_empresa(+)
                    and e.id_item = ace.id_item(+)
                    and e.id_categoria = ace.id_categoria(+)
                    and e.id_empresa = mg.id_empresa
                    and i.cod_item||c.descricao like upper('%$pCod%')
                    and em.apelido = ?
                    and rownum <= 5";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(1, $pEmp);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('custo_contabil', new ValueStrategy);
            $hydrator->addStrategy('icms', new ValueStrategy);
            $hydrator->addStrategy('pis_cofins', new ValueStrategy);
            $hydrator->addStrategy('margem', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function simulacaoTransfAction()
    {
        $data = array();
        
        try {
            $dest = $this->params()->fromQuery('param1',null);
            $orig = $this->params()->fromQuery('param2',null);
            $lprod = $this->params()->fromQuery('param3',null);
            $vfrete  = $this->params()->fromQuery('param4',null);

            if(!$dest){
                $dest   = $this->params()->fromPost('param1',null);
            }
            if(!$orig){
                $orig   = $this->params()->fromPost('param2',null);
            }
            if(!$lprod){
                $lprod   = $this->params()->fromPost('param3',null);
            }
            if(!$vfrete){
                $vfrete   = $this->params()->fromPost('param4',null);
            }

            $listaitens = explode(',',$lprod);
            $lprod='';

            for ($i=0;$i < count($listaitens); $i++) {
                
                if($lprod){
                    $lprod .= ','."'".$listaitens[$i]."'";
                }else{
                    $lprod = "'".$listaitens[$i]."'";
                }
            }

            $session = $this->getSession();
            $usuario = $session['info'];

            $em = $this->getEntityManager();

            $sql = "select distinct em.apelido as emp,
                            m.descricao as marca,
                            i.cod_item||c.descricao as cod_item,
                            i.descricao,
                            null as frete_rat,
                            null total
                        from ms.tb_estoque e,
                    ms.tb_item i,
                    ms.tb_categoria c,
                    ms.tb_item_categoria ic,
                    ms.empresa em,
                    ms.tb_marca m
                    where e.id_item = i.id_item
                    and e.id_categoria = c.id_categoria
                    and e.id_empresa = em.id_empresa
                    and e.id_item = ic.id_item
                    and e.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca
                    and i.cod_item||c.descricao in ($lprod)
                    and em.apelido = '$dest'";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('frete_rat', new ValueStrategy);
            $hydrator->addStrategy('total', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function inserirPedidoAction()
    {
        $data = array();
        
        try {
            $session = $this->getSession();
            $usuario = $session['info']->usuario_sistema;

            $dados = $this->params()->fromPost('dados',null);

            // $dadosJson = json_decode($dados);
            $objJson = new Json;
            $dadosJson = $objJson->decode($dados, true);

            $emp_orig = $dadosJson['emp_orig'];
            $emp_dest = $dadosJson['emp_dest'];
            $frete    = $dadosJson['frete'];
            $imposto  = $dadosJson['imposto'];
            $total    = $dadosJson['total'];
            $observ   = $dadosJson['obs'];
            $arrayItens = $dadosJson['itens'];

            $em = $this->getEntityManager();
            $conn = $em->getConnection();

            $sql = "select nvl(max(id_pedido),0)+1 max from xtf_pedido";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $newPedido = $results[0]['MAX'];

            $sql = "call xpkg_tf_pedido.inserir_pedido(:id_pedido, :emp_orig, :emp_dest, :frete, :imposto, :total, :id_usu, :observacao)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id_pedido', $newPedido);
            $stmt->bindParam(':emp_orig', $emp_orig);
            $stmt->bindParam(':emp_dest', $emp_dest);
            $stmt->bindParam(':frete', $frete);
            $stmt->bindParam(':imposto', $imposto);
            $stmt->bindParam(':total', $total);
            $stmt->bindParam(':id_usu', $usuario);
            $stmt->bindParam(':observacao', $observ);
            $result = $stmt->execute();

            for ($i=0; $i < count($arrayItens); $i++) {

                $elemento =  $arrayItens[$i];
                $coditem = $elemento['coditem'];
                $qt_produto = $elemento['qtproduto'];
                $custo_produto = $elemento['custoproduto'];
                $frete = $elemento['frete'];
                $custo_unitario = $elemento['custounitario'];
                $icms = $elemento['icms'];
                $piscofins = $elemento['piscofins'];
                $margem = $elemento['margem'];
                $preco_unitario = $elemento['preco'];
                $total = $elemento['valorproduto'];

                $sql = "call xpkg_tf_pedido.inserir_item_pedido( :id_pedido, :cod_item, :qt_produto, :custo_produto, :frete, :custo_unitario, :icms, :piscofins, :margem, :preco_unitario, :total)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id_pedido', $newPedido);
                $stmt->bindParam(':cod_item', $coditem);
                $stmt->bindParam(':qt_produto', $qt_produto);
                $stmt->bindParam(':custo_produto', $custo_produto);
                $stmt->bindParam(':frete', $frete);
                $stmt->bindParam(':custo_unitario', $custo_unitario);
                $stmt->bindParam(':icms', $icms);
                $stmt->bindParam(':piscofins', $piscofins);
                $stmt->bindParam(':margem', $margem);
                $stmt->bindParam(':preco_unitario', $preco_unitario);
                $stmt->bindParam(':total', $total);
                $resultitem = $stmt->execute();
                
            }

            $this->setCallbackData($resultitem);
            $this->setMessage("$newPedido");
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function listarProdutosPedidosAction()
    {
        $data = array();
        
        try {

            $pEmpDest    = $this->params()->fromQuery('empdest',null);
            $pEmpOrig    = $this->params()->fromQuery('emporig',null);
            $pInicio     = $this->params()->fromQuery('dtinicio',null);
            $pFim        = $this->params()->fromQuery('dtfim',null);
            $pStatus     = $this->params()->fromQuery('status',null);
            $andSql = '';

            if($pEmpDest && ($pEmpDest != 'EC')){
                $andSql .= "and p.emp_dest = '$pEmpDest' ";
            }

            if($pEmpOrig && ($pEmpOrig != 'EC')){
                $andSql .= "and p.emp_orig = '$pEmpOrig' ";
            }

            if($pInicio){
                $andSql .= "and p.dt_pedido >= '$pInicio' ";
            }else{
                $andSql .= "and p.dt_pedido >= sysdate-30 ";
            }

            if($pFim){
                $andSql .= "and p.dt_pedido <= '$pFim' ";
            }else{
                $andSql .= "and p.dt_pedido <= sysdate ";
            }

            if($pStatus){
                $andSql .= "and p.status = trim('$pStatus') ";
            }

            $em = $this->getEntityManager();
            
            $sql = "select  p.id_pedido,
                            p.dt_pedido,
                            p.emp_orig,
                            p.emp_dest,
                            p.frete total_frete,
                            p.total,
                            m.descricao as marca,
                            i.COD_ITEM,
                            it.descricao,
                            e.id_locacao as locacao,
                            i.QT_PRODUTO,
                            i.CUSTO_PRODUTO,
                            i.FRETE,
                            i.CUSTO_UNITARIO,
                            i.ICMS,
                            i.PISCOFINS,
                            i.MARGEM,
                            i.PRECO_UNITARIO,
                            i.TOTAL total_item,
                            p.observacao,
                            p.id_usu,
                            case when p.status = 'C'
                                then 'Cancelado'
                                else 'Ativo'
                            end status
                        from xtf_pedido_item i,
                             xtf_pedido p,
                             ms.tb_estoque e,
                             ms.tb_item it,
                             ms.tb_categoria c,
                             ms.tb_item_categoria ic,
                             ms.empresa em,
                             ms.tb_marca m
                    where p.id_pedido = i.id_pedido
                    $andSql
                    and e.id_item = it.id_item
                    and e.id_categoria = c.id_categoria
                    and e.id_empresa = em.id_empresa
                    and e.id_item = ic.id_item
                    and e.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca
                    and it.cod_item||c.descricao in (i.cod_item)
                    and em.apelido = p.emp_orig
                    order by p.id_pedido desc, p.dt_pedido desc";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            // $stmt->bindValue(1, $pEmp);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('id_pedido', new ValueStrategy);
            $hydrator->addStrategy('total_frete', new ValueStrategy);
            $hydrator->addStrategy('total', new ValueStrategy);
            $hydrator->addStrategy('custo_produto', new ValueStrategy);
            $hydrator->addStrategy('frete', new ValueStrategy);
            $hydrator->addStrategy('custo_unitario', new ValueStrategy);
            $hydrator->addStrategy('icms', new ValueStrategy);
            $hydrator->addStrategy('piscofins', new ValueStrategy);
            $hydrator->addStrategy('margem', new ValueStrategy);
            $hydrator->addStrategy('preco_unitario', new ValueStrategy);
            $hydrator->addStrategy('total_item', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function cancelarPedidoAction()
    {
        $data = array();
        
        try {
            $session = $this->getSession();
            $usuario = $session['info']->usuario_sistema;

            $id_pedido = $this->params()->fromPost('idPedido',null);

            $em = $this->getEntityManager();
            $conn = $em->getConnection();

            $sql = "call xpkg_tf_pedido.cancelar_pedido( :id_pedido, :id_usu_canc)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id_pedido', $id_pedido);
            $stmt->bindParam(':id_usu_canc', $usuario);
            $result = $stmt->execute();
            $this->setCallbackData($data);
            $this->setMessage("Solicitação enviada com sucesso.");
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }
}
