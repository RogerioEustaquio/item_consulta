<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
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
            

            $this->setCallbackData($stmt->fetchAll());
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }
    
}
