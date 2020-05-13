<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Zend\Db\ResultSet\HydratingResultSet;
use Core\Stdlib\StdClass;
use Core\Hydrator\ObjectProperty;
use Core\Hydrator\Strategy\ValueStrategy;
use Core\Mvc\Controller\AbstractRestfulController;

class PrecoSugeridoController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }

    public function listarempresasAction()
    {
        $data = array();
        
        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $usuario->empresa = 'SA';

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

    public function listarprecosugeridoAction()
    {
        $data = array();

        $getIdEmp   = $this->params()->fromPost('param1',null);
        $getProduto = $this->params()->fromPost('param2',null);

        if(!$getIdEmp){
            $getIdEmp = $this->params()->fromQuery('param1',null);
        }
        
        if(!$getProduto){
            $getProduto = $this->params()->fromQuery('param2',null);
        }
        
        try {

            $em = $this->getEntityManager();
            
            $sql = "select em.apelido as emp,
                            i.cod_item||c.descricao as cod_item,
                            i.descricao,
                            m.descricao as marca,
                            nvl(ace.icms,0) as icms,
                            nvl(ic.aliq_pis,0)+nvl(ic.aliq_cofins,0) as pis_cofins,
                            mkp.letra_desconto as letra_desconto,
                            mkp.perc_desconto as perc_desconto_max,
                            mkp.preco as preco,
                            round((1+(mkp.markup/100))*e.custo_contabil,2) as preco_sugerido,
                            e.estoque,
                            e.id_locacao as locacao
                    from ms.tb_estoque e,
                            ms.empresa em,
                            ms.tb_item_categoria ic,
                            ms.tb_item i,
                            ms.tb_categoria c,
                            ms.tb_marca m,
                            ( SELECT A.ID_EMPRESA, A.ID_ITEM, A.ID_CATEGORIA, A.PRECO_VENDA as preco, A.MARKUP,
                                    A.PERC_COMISSAO_GERENTE as comissao,
                                    A.MARGEM_MAXIMA_MARKUP, A.ID_DESCONTO_LETRA as letra_Desconto, B.PERC_DESCONTO
                                FROM MS.TB_TAB_PRECO_VALOR A, MS.TB_DESCONTO_LETRA B
                            WHERE A.ID_EMPRESA = B.ID_EMPRESA
                                AND A.ID_DESCONTO_LETRA = B.ID_DESCONTO_LETRA(+)
                                AND (A.ID_EMPRESA, A.ID_TAB_PRECO) IN (SELECT ID_EMPRESA, VALOR FROM MS.PARAM_EMPRESA
                                                                        WHERE ID_PARAM = 'TAB_PRECO_PADRAO') ) MKP,
                            (SELECT ID_EMPRESA, ID_ITEM, ID_CATEGORIA,
                                    GERAR_PRECO_VENDA,
                                    icms
                            FROM pricing.vw_produto_parametro) ace,
                            pricing.vw_produto_restricao pr
                    where e.id_item = ic.id_item
                    and e.id_categoria = ic.id_categoria
                    and e.id_item = i.id_item
                    and e.id_categoria = c.id_categoria
                    and e.id_empresa = em.id_empresa
                    and ic.id_marca = m.id_marca
                    and e.id_empresa = mkp.id_empresa
                    and e.id_item = mkp.id_item
                    and e.id_categoria = mkp.id_categoria
                    and e.id_empresa = ace.id_empresa(+)
                    and e.id_item = ace.id_item(+)
                    and e.id_categoria = ace.id_categoria(+)
                    and e.id_empresa = pr.id_empresa(+)
                    and e.id_item = pr.id_item(+)
                    and e.id_categoria = pr.id_categoria(+)
                    and e.id_empresa not in (11, 26, 28)
                    and nvl(e.custo_contabil,0) > 0
                    and nvl(mkp.preco,0) > 0
                    and i.cod_item = '$getProduto'
                    and em.apelido = '$getIdEmp'";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('icms', new ValueStrategy);
            $hydrator->addStrategy('pis_cofins', new ValueStrategy);
            $hydrator->addStrategy('preco', new ValueStrategy);
            $hydrator->addStrategy('preco_sugerido', new ValueStrategy);
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

    public function listarprodutosAction()
    {   
        $data = array();
        
        try {

            $pEmp = $this->params()->fromQuery('emp',null);
            $pCod = $this->params()->fromQuery('codigo',null);

            if(!$pEmp || !$pCod){
                throw new \Exception('Parâmetros não informados.');
            }

            $em = $this->getEntityManager();
            
            $sql = "select distinct em.apelido as emp, i.cod_item as cod_item, i.descricao,
                            null as preco_venda, null custo_contabil
                        from ms.tb_estoque e,
                        ms.tb_item i,
                        ms.tb_categoria c,
                        ms.tb_item_categoria ic,
                        ms.empresa em
                    where e.id_item = i.id_item
                    and e.id_categoria = c.id_categoria
                    and e.id_empresa = em.id_empresa
                    and e.id_item = ic.id_item
                    and e.id_categoria = ic.id_categoria
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

    public function listarprodutoestoqueAction()
    {
        $data = array();
        
        try {

            $pCod = $this->params()->fromQuery('param1',null);

            if(!$pCod){
                throw new \Exception('Parâmetros não informados.');
            }

            $em = $this->getEntityManager();
            
            $sql = "select distinct em.apelido as emp, i.cod_item as cod_item, i.descricao, e.estoque
            from ms.tb_estoque e,
                    ms.tb_item i,
                    ms.tb_categoria c,
                    ms.tb_item_categoria ic,
                    ms.empresa em
            where e.id_item = i.id_item
            and e.id_categoria = c.id_categoria
            and e.id_empresa = em.id_empresa
            and e.id_item = ic.id_item
            and e.id_categoria = ic.id_categoria
            and em.id_empresa not in (26, 11, 28, 27, 20)
            and i.cod_item||c.descricao = upper('$pCod')
            order by 1";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('custo_contabil', new ValueStrategy);
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

}
