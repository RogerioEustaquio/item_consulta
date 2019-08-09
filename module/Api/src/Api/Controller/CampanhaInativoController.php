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
                   and rownum <= 5
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
