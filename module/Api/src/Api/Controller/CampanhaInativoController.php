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
                select emp, cod_item, descricao, marca, estoque_qtde as estoque, pa.preco 
                  from pricing.vm_produto_preco_analise pa
                 where pa.emp = 'AP'
                   and pa.curva_nbs = 'I'
                   and pa.estoque_qtde > 0
                   and rownum <= 100
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            // $stmt->bindValue(1, $this->params()->fromQuery('empresa',null));
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
                        email, preco, s.id_campanha_solicitacao_status as id_status, t.descricao as status, icx.marca
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
            $stmt->bindValue(1, 'AP');
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
                'id_funcionario' => $user->idFuncionario,
                'email' => $user->email,
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
