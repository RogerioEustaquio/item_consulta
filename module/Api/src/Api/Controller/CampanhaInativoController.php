<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Zend\Db\ResultSet\HydratingResultSet;
use Core\Stdlib\StdClass;
use Core\Hydrator\ObjectProperty;
use Core\Hydrator\Strategy\ValueStrategy;
use Core\Mvc\Controller\AbstractRestfulController;

class CampanhaInativoController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }

    public function listaritensinativosAction()
    {   
        $data = array();
        
        try {
            $em = $this->getEntityManager();
            
            $sql = "
                select e.apelido as emp, i.cod_item||c.descricao as cod_item, i.descricao, m.descricao as marca,
                        es.estoque, 
                        es.custo_contabil,
                        pi.perc_promocao as preco,
                        round((decode(es.fx_custo,'0-50',10,'51-100',8,'101-250',7,'251-500',6,'501-1000',5,5)/100) * pi.perc_promocao, 
                        (case when es.custo_contabil < 1 then 4 else 2 end) ) as bonus
                from ms.tb_promocao p,
                        ms.tb_promocao_item pi,
                        ms.tb_item i,
                        ms.tb_categoria c,
                        ms.tb_item_categoria ic,
                        ms.tb_marca m,
                        ms.empresa e,
                        (select id_empresa, id_item, id_categoria, estoque, custo_contabil,
                                (case when custo_contabil <= 50 then '0-50'
                                    when custo_contabil > 50 and custo_contabil <= 100  then '51-100'
                                    when custo_contabil > 100 and custo_contabil <= 250  then '101-250'
                                    when custo_contabil > 250 and custo_contabil <= 500  then '251-500'
                                    when custo_contabil > 500 and custo_contabil <= 1000  then '501-1000'
                                    when custo_contabil > 1000 and custo_contabil <= 5000  then '1001-5000'
                                    when custo_contabil > 5000 and custo_contabil <= 10000  then '5001-10000'
                                    when custo_contabil > 10000 then '10001-X'
                                end) as fx_custo
                        from ms.tb_estoque) es
                where p.id_empresa = pi.id_empresa
                    and p.id_promocao = pi.id_promocao
                    and pi.id_item = i.id_item
                    and pi.id_categoria = c.id_categoria
                    and pi.id_item = ic.id_item 
                    and pi.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca 
                    and pi.id_empresa = e.id_empresa
                    and pi.id_empresa = es.id_empresa
                    and pi.id_item = es.id_item
                    and pi.id_categoria = es.id_categoria
                    and p.descricao like 'Campanha% Inativos'
                    and e.apelido = ?
                  order by preco desc
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(1, $this->params()->fromQuery('empresa',null));
            // $stmt->bindValue(2, $this->params()->fromQuery('codItem',null));
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('estoque', new ValueStrategy);
            $hydrator->addStrategy('preco', new ValueStrategy);
            $hydrator->addStrategy('bonus', new ValueStrategy);
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

    public function listarsugestoesenviadasAction()
    {   
        $data = array();
        
        try {
            $em = $this->getEntityManager();
            
            $sql = "
                select s.emp, s.cod_item, icx.descricao, to_char(data_solicitacao, 'DD/MM/RRRR HH24:MI:SS') as data_solicitacao, 
                        replace(s.email, '@jspecas.com.br', '') as email, s.usuario,
                        preco, s.id_campanha_solicitacao_status as id_status, t.descricao as status, icx.marca
                from xp_campanha_solicitacao s,
                        xp_campanha_solicitacao_status t,
                        (select em.apelido as emp, i.cod_item||c.descricao as cod_item, i.descricao, m.descricao as marca 
                        from ms.tb_estoque e,
                                ms.tb_item i,
                                ms.tb_categoria c,
                                ms.tb_item_categoria ic,
                                ms.tb_marca m,
                                ms.empresa em
                        where e.id_item = i.id_item
                            and e.id_categoria = c.id_categoria
                            and e.id_item = ic.id_item
                            and e.id_categoria = ic.id_categoria
                            and ic.id_marca = m.id_marca
                            and e.id_empresa = em.id_empresa) icx
                where s.id_campanha_solicitacao_status = t.id_campanha_solicitacao_status
                    and s.emp = icx.emp
                    and s.cod_item = icx.cod_item
                    and s.emp = ?
                order by s.data_solicitacao desc
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(1, $this->params()->fromQuery('empresa',null));
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('estoque', new ValueStrategy);
            $hydrator->addStrategy('preco', new ValueStrategy);
            $hydrator->addStrategy('bonus', new ValueStrategy);
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

    public function sugerirprecoAction()
    {   
        $data = array();
        
        try {
            $session = $this->SessionPlugin()->getSession();
            $user = $session['info'];
            $pEmp = $this->params()->fromPost('emp',null);
            $pCodItem = $this->params()->fromPost('codItem',null);
            $pPreco = ValueStrategy::toValue($this->params()->fromPost('preco',null));
            $pComentario = $this->params()->fromPost('comentario',null);
            
            if(!$pEmp || !$pCodItem || !$pPreco){
                throw new \Exception('Erro ao salvar os dados.');
            }
            
            $conn = $this->getConnection();
            $conn->insert('xp_campanha_solicitacao', array(
                'emp' => $pEmp,
                'cod_item' => $pCodItem,
                'data_solicitacao' => date('d/m/Y H:i:s'),
                'id_funcionario' => $user['idFuncionario'],
                'usuario' => $user['usuarioSistema'],
                'email' => $user['email'],
                'preco' => $pPreco,
                'comentario' => $pComentario,
                'id_campanha_solicitacao_status' => 1
            ));

            $this->setCallbackData($data);

        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }
    
}
