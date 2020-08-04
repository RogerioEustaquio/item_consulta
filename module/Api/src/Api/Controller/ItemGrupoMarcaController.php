<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Zend\Db\ResultSet\HydratingResultSet;
use Core\Stdlib\StdClass;
use Core\Hydrator\ObjectProperty;
use Core\Hydrator\Strategy\ValueStrategy;
use Core\Mvc\Controller\AbstractRestfulController;
use Zend\Json\Json;


class ItemGrupoMarcaController extends AbstractRestfulController
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

            if($usuario['empresa'] != "EC"){

                $sql = "select id_empresa, apelido as nome
                            from ms.empresa 
                        where id_matriz = 1 
                        and apelido = '".$usuario['empresa']."'
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

    public function listargrupomarcaAction()
    {
        $data = array();

        $emp        = $this->params()->fromQuery('emp',null);
        $produto    = $this->params()->fromQuery('produto',null);
        $estoque    = $this->params()->fromQuery('estoque',null);
        $dtinicio   = $this->params()->fromQuery('dtinicio',null);
        $dtfinal    = $this->params()->fromQuery('dtfinal',null);
        $dtiniciov  = $this->params()->fromQuery('dtiniciov',null);
        $dtfinalv   = $this->params()->fromQuery('dtfinalv',null);
        
        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $andSql = '';

            $em = $this->getEntityManager();
            
            if($emp && $emp != "EC"){
                $andSql = " and em.apelido = '$emp'";
            }

            if($produto){
                $andSql .= " and (i.cod_item||c.descricao like '%$produto%'";
                $andSql .= " or i.descricao like '%$produto%')";
            }

            if($estoque){
                if($estoque =='N'){
                    $andSql .= " and nvl(e.estoque,0) = 0";
                }else{
                    $andSql .= " and nvl(e.estoque,0) >= 1";
                }
                
            }

            if($dtinicio){
                $andSql .= " and trunc(e.ultima_compra) >= '$dtinicio'";
            }

            if($dtfinal){
                $andSql .= " and trunc(e.ultima_compra) <= '$dtfinal'";
            }

            if($dtiniciov){
                $andSql .= " and trunc(e.ultima_venda) >= '$dtiniciov'";
            }

            if($dtfinalv){
                $andSql .= " and trunc(e.ultima_venda) <= '$dtfinalv'";
            }

            $sql = "select g.id_grupo_marca,
                           g.descricao as grupo_marca,
                           count(*) as skus
                    from ms.tb_estoque e,
                            ms.tb_item i,
                            ms.tb_categoria c,
                            ms.tb_item_categoria ic,
                            ms.tb_marca m,
                            ms.tb_grupo_marca g,
                            ms.empresa em,
                            (select distinct id_empresa,
                                    id_item,
                                    id_categoria
                                from PRODUTO_PJ_ADPORTFOLIO 
                             where subgrupo = 'NOVOS') pj 
                    where e.id_item = i.id_item
                    and e.id_categoria = c.id_categoria
                    and e.id_item = ic.id_item
                    and e.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca
                    and m.id_grupo_marca = g.id_grupo_marca
                    and e.id_empresa = em.id_empresa
                    --and e.id_curva_abc = 'E'
                    and ( e.ultima_compra > add_months(sysdate, -6) or e.estoque > 0 )
                    and e.id_empresa = pj.id_empresa
                    and e.id_item = pj.id_item
                    and e.id_categoria = pj.id_categoria 
                    $andSql
                    group by g.id_grupo_marca,g.descricao
                    order by skus desc
            ";

            // print "$sql";
            // exit;
            
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
    
    public function listarmarcaAction()
    {
        $data = array();

        $emp         = $this->params()->fromQuery('emp',null);
        $grupomarca  = $this->params()->fromQuery('grupoMarca',null); //Ex: 130,128,131,129,146,136
        $produto     = $this->params()->fromQuery('produto',null);
        $estoque     = $this->params()->fromQuery('estoque',null);
        $dtinicio    = $this->params()->fromQuery('dtinicio',null);
        $dtfinal     = $this->params()->fromQuery('dtfinal',null);
        $dtiniciov   = $this->params()->fromQuery('dtiniciov',null);
        $dtfinalv    = $this->params()->fromQuery('dtfinalv',null);

        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $andSql = '';
            if($emp && $emp != "EC"){
                $andSql = " and em.apelido = '$emp'";
            }
    
            if($grupomarca){
                $andSql .= " and g.id_grupo_marca in ($grupomarca)";
            }

            if($produto){
                $andSql .= " and (i.cod_item||c.descricao like '%$produto%'";
                $andSql .= " or i.descricao like '%$produto%')";
            }

            if($estoque){
                if($estoque =='N'){
                    $andSql .= " and nvl(e.estoque,0) = 0";
                }else{
                    $andSql .= " and nvl(e.estoque,0) >= 1";
                }
                
            }

            if($dtinicio){
                $andSql .= " and trunc(e.ultima_compra) >= '$dtinicio'";
            }

            if($dtfinal){
                $andSql .= " and trunc(e.ultima_compra) <= '$dtfinal'";
            }

            if($dtiniciov){
                $andSql .= " and trunc(e.ultima_venda) >= '$dtiniciov'";
            }

            if($dtfinalv){
                $andSql .= " and trunc(e.ultima_venda) <= '$dtfinalv'";
            }

            $em = $this->getEntityManager();
            
            $sql = "select  g.id_grupo_marca,
                            m.id_marca,
                            m.descricao as marca,
                            count(*) as skus
                    from ms.tb_estoque e,
                            ms.tb_item i,
                            ms.tb_categoria c,
                            ms.tb_item_categoria ic,
                            ms.tb_marca m,
                            ms.tb_grupo_marca g,
                            ms.empresa em,
                            (select distinct id_empresa,
                                    id_item,
                                    id_categoria
                                from PRODUTO_PJ_ADPORTFOLIO 
                             where subgrupo = 'NOVOS') pj 
                    where e.id_item = i.id_item
                    and e.id_categoria = c.id_categoria
                    and e.id_item = ic.id_item
                    and e.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca
                    and m.id_grupo_marca = g.id_grupo_marca
                    and e.id_empresa = em.id_empresa
                    --and e.id_curva_abc = 'E'
                    and ( e.ultima_compra > add_months(sysdate, -6) or e.estoque > 0 )
                    and e.id_empresa = pj.id_empresa
                    and e.id_item = pj.id_item
                    and e.id_categoria = pj.id_categoria 
                    $andSql
                    group by g.id_grupo_marca, m.id_marca, m.descricao
                    order by skus desc
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

    public function listaritemAction()
    {
        $data = array();

        $emp        = $this->params()->fromQuery('emp',null);
        $grupomarca = $this->params()->fromQuery('grupoMarca',null); //Ex: 130,128,131,129,146,136
        $marca      = $this->params()->fromQuery('marca',null); //Ex: 130,128,131,129,146,136
        $produto    = $this->params()->fromQuery('produto',null);
        $estoque    = $this->params()->fromQuery('estoque',null);
        $dtinicio   = $this->params()->fromQuery('dtinicio',null);
        $dtfinal    = $this->params()->fromQuery('dtfinal',null);
        $dtiniciov  = $this->params()->fromQuery('dtiniciov',null);
        $dtfinalv   = $this->params()->fromQuery('dtfinalv',null);
        $inicio     = $this->params()->fromQuery('start',null);
        $final      = $this->params()->fromQuery('limit',null);
        
        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $andSql = '';
            if($emp  && $emp != "EC"){
                $andSql = " and em.apelido = '$emp'";
            }
            if($grupomarca){
                $andSql .= " and g.id_grupo_marca in ($grupomarca)";
            }
            if($marca){
                $andSql .= " and m.id_marca in ($marca)";
            }

            if($produto){
                $andSql .= " and (i.cod_item||c.descricao like '%$produto%'";
                $andSql .= " or i.descricao like '%$produto%')";
            }

            if($estoque){
                if($estoque =='N'){
                    $andSql .= " and nvl(e.estoque,0) = 0";
                }else{
                    $andSql .= " and nvl(e.estoque,0) >= 1";
                }
                
            }

            if($dtinicio){
                $andSql .= " and trunc(e.ultima_compra) >= '$dtinicio'";
            }

            if($dtfinal){
                $andSql .= " and trunc(e.ultima_compra) <= '$dtfinal'";
            }

            if($dtiniciov){
                $andSql .= " and trunc(e.ultima_venda) >= '$dtiniciov'";
            }

            if($dtfinalv){
                $andSql .= " and trunc(e.ultima_venda) <= '$dtfinalv'";
            }

            $em = $this->getEntityManager();
            $conn = $em->getConnection();
            
            $sql = "select em.apelido as emp,
                            g.descricao as grupo_marca,
                            m.descricao as marca,
                            i.cod_item||c.descricao as cod_item,
                            i.descricao,
                            trunc(e.ultima_compra) as ultima_compra,
                            trunc(e.ultima_venda) as ultima_venda,
                            e.estoque
                    from ms.tb_estoque e,
                            ms.tb_item i,
                            ms.tb_categoria c,
                            ms.tb_item_categoria ic,
                            ms.tb_marca m,
                            ms.tb_grupo_marca g,
                            ms.empresa em,
                            (select distinct id_empresa,
                                    id_item,
                                    id_categoria
                                from PRODUTO_PJ_ADPORTFOLIO 
                             where subgrupo = 'NOVOS') pj 
                    where e.id_item = i.id_item
                    and e.id_categoria = c.id_categoria
                    and e.id_item = ic.id_item
                    and e.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca
                    and m.id_grupo_marca = g.id_grupo_marca
                    and e.id_empresa = em.id_empresa
                    --and e.id_curva_abc = 'E'
                    and ( e.ultima_compra > add_months(sysdate, -6) or e.estoque > 0 )
                    and e.id_empresa = pj.id_empresa
                    and e.id_item = pj.id_item
                    and e.id_categoria = pj.id_categoria 
                    $andSql
                    order by emp, grupo_marca, ultima_compra desc, marca
            ";

            $sql1 = "select count(*) as totalCount from ($sql)";
            $stmt = $conn->prepare($sql1);
            $stmt->execute();
            $resultCount = $stmt->fetchAll();

            $sql = "
                SELECT PGN.*
                  FROM (SELECT ROWNUM AS RNUM, PGN.*
                          FROM ($sql) PGN) PGN
                 WHERE RNUM BETWEEN " . ($inicio +1 ) . " AND " . ($inicio + $final) . "
            ";

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
        
        $objReturn = $this->getCallbackModel();

        $objReturn->total = $resultCount[0]['TOTALCOUNT'];

        return $objReturn;
    }
}
