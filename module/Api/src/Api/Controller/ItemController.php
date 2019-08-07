<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Core\Mvc\Controller\AbstractRestfulController;

class ItemController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }

    public function listarparametrosAction()
    {   
        $data = array();
        
        try {
            $em = $this->getEntityManager();
            
            
            $sql = "
                SELECT EM.APELIDO AS EMPRESA, I.COD_ITEM||C.DESCRICAO AS COD_ITEM, 
                        A.PRECO_VENDA AS PRECO, A.MARKUP, A.PERC_COMISSAO_GERENTE AS COMISSAO_GERENTE, 
                        A.MARGEM_MAXIMA_MARKUP AS MARGEM_MAXIMA, 
                        A.ID_DESCONTO_LETRA AS LETRA_DESCONTO, B.PERC_DESCONTO AS PERCENTUAL_DESCONTO
                FROM MS.TB_TAB_PRECO_VALOR A,
                        MS.TB_DESCONTO_LETRA B,
                        (SELECT ID_EMPRESA, VALOR AS ID_TAB_PRECO FROM MS.PARAM_EMPRESA
                        WHERE ID_PARAM = 'TAB_PRECO_PADRAO') TP,
                        MS.EMPRESA EM,
                        MS.TB_ITEM I,
                        MS.TB_CATEGORIA C
                WHERE A.ID_EMPRESA = B.ID_EMPRESA
                    AND A.ID_DESCONTO_LETRA = B.ID_DESCONTO_LETRA(+)   
                    AND A.ID_EMPRESA = TP.ID_EMPRESA
                    AND A.ID_TAB_PRECO = TP.ID_TAB_PRECO
                    AND A.ID_EMPRESA = EM.ID_EMPRESA
                    AND A.ID_ITEM = I.ID_ITEM
                    AND A.ID_CATEGORIA = C.ID_CATEGORIA
                    AND EM.APELIDO = ?
                    AND I.COD_ITEM||C.DESCRICAO = ?
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);

            $stmt->bindValue(1, $this->params()->fromQuery('empresa',null));
            $stmt->bindValue(2, $this->params()->fromQuery('codItem',null));
            $stmt->execute();
            $data = $stmt->fetchAll();
            
        } catch (\Exception $e) {
            $message = $e->getMessage();
        }
        
        $json = new JsonModel($data);
        return $this->getResponseWithHeader()->setContent($json->serialize());
    }
    
}
