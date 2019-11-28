<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Zend\Db\ResultSet\HydratingResultSet;
use Core\Stdlib\StdClass;
use Core\Hydrator\ObjectProperty;
use Core\Hydrator\Strategy\ValueStrategy;
use Core\Mvc\Controller\AbstractRestfulController;

class PvSolicitacaoCadastroController extends AbstractRestfulController
{

    public function listarsolicitacoesAction()
    {   
        $data = array();
        
        try {

            $pEmp = $this->params()->fromQuery('emp',null);

            if(!$pEmp){
                throw new \Exception('Parâmetros não informados.');
            }

            $em = $this->getEntityManager();
            
            $sql = "
                select em.apelido as emp, i.cod_item||c.descricao as cod_item, i.descricao, m.descricao as marca,
                        s.custo, s.preco_sugerido, s.preco_confirmado,
                        s.status as id_status, decode(s.status,0,'Pendente',1,'Concluída') as descricao_status,
                        s.usuario_solicitacao,
                        to_char(s.data_solicitacao, 'DD/MM/RRRR HH24:MI:SS') as data_solicitacao,
                        s.comentario_solicitacao
                   from pricing.xpv_solicitacaocad s,
                        ms.tb_item_categoria ic,
                        ms.tb_item i,
                        ms.tb_categoria c,
                        ms.tb_marca m,
                        ms.empresa em
                where s.id_item = ic.id_item
                    and s.id_categoria = ic.id_categoria
                    and s.id_item = i.id_item
                    and s.id_categoria = c.id_categoria
                    and ic.id_marca = m.id_marca    
                    and s.id_empresa = em.id_empresa
            ";

            // Filter
            // Todas as solicitações para o escritório central
            if($pEmp !== 'EC')
            $sql .= " and em.apelido = ? ";

            // Order by
            $sql .= " order by data_solicitacao desc ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);

            // Todas as solicitações para o escritório central
            if($pEmp !== 'EC')
            $stmt->bindValue(1, $pEmp);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('data_solicitacao', new ValueStrategy);
            $hydrator->addStrategy('data_conclusao', new ValueStrategy);
            $hydrator->addStrategy('custo', new ValueStrategy);
            $hydrator->addStrategy('preco_sugerido', new ValueStrategy);
            $hydrator->addStrategy('preco_confirmado', new ValueStrategy);
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
            
            $sql = "
                 select em.apelido as emp, i.cod_item||c.descricao as cod_item, i.descricao, m.descricao as marca,
                        pv.preco_venda, e.custo_contabil
                   from ms.tb_estoque e,
                        ms.tb_item i,
                        ms.tb_categoria c,
                        ms.tb_item_categoria ic,
                        ms.tb_marca m,
                        ms.empresa em,
                        (select id_empresa, id_item, id_categoria, preco_venda
                        from ms.tb_tab_preco_valor
                        where id_tab_preco = 1) pv
                  where e.id_item = i.id_item
                    and e.id_categoria = c.id_categoria
                    and e.id_empresa = em.id_empresa
                    and e.id_empresa = pv.id_empresa(+)
                    and e.id_item = pv.id_item(+)
                    and e.id_categoria = pv.id_categoria(+)
                    and e.id_item = ic.id_item
                    and e.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca
                    and i.cod_item||c.descricao like upper('%$pCod%')
                    and em.apelido = ?
                    and pv.preco_venda is null
                    and rownum <= 5
            ";
            
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
    
    public function enviarsolicitacaoAction()
    {   
        $data = array();
        
        try {
            
            $pUsuario = 'EVERTON';
            $pEmp = $this->params()->fromPost('emp',null);
            $pCodItem = $this->params()->fromPost('produto',null);
            $pCusto = str_replace(",", ".", $this->params()->fromPost('custo',null));
            $pPrecoSugerido = str_replace(",", ".", $this->params()->fromPost('precoSugerido',null));
            $pComentario = $this->params()->fromPost('comentario',null);

            // print_r(array(
            //     $pUsuario,
            //     $pEmp,
            //     $pCodItem,
            //     $pCusto,
            //     $pPrecoSugerido,
            //     $pComentario
            // ));
            
            if(!$pEmp || !$pCodItem){
                throw new \Exception('Produto não informado.');
            }

            if(!$pCusto){
                throw new \Exception('Custo não informado.');
            }

            $conn = $this->getConnection();

            $sql = "call pkg_xpv_solicitacaocad.inserir(:emp, :cod_item, :custo, :preco_sugerido, :usuario, :comentario)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':emp', $pEmp);
            $stmt->bindParam(':cod_item', $pCodItem);
            $stmt->bindParam(':custo', $pCusto);
            $stmt->bindParam(':preco_sugerido', $pPrecoSugerido);
            $stmt->bindParam(':usuario', $pUsuario);
            $stmt->bindParam(':comentario', $pComentario);
            $result = $stmt->execute();
            
            $this->setCallbackData($data);
            $this->setMessage("Solicitação enviada com sucesso.");

        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function concluirsolicitacaoAction()
    {   
        $data = array();
        
        try {
            
            $pUsuario = 'EVERTON';
            $pSolicitacao = $this->params()->fromPost('solicitacao',null);
            $pPrecoConfirmado = $this->params()->fromPost('precoConfirmado',null);
            $pComentario = $this->params()->fromPost('comentario',null);

            if(!$pSolicitacao){
                throw new \Exception('Solicitação não informada.');
            }

            $conn = $this->getConnection();

            $sql = "call pkg_xpv_solicitacaocad.concluir(:id_solicitacao, :usuario, :comentario, :preco_confirmado)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id_solicitacao', $pSolicitacao);
            $stmt->bindParam(':usuario', $pUsuario);
            $stmt->bindParam(':comentario', $pComentario);
            $stmt->bindParam(':preco_confirmado', $pPrecoConfirmado);
            $result = $stmt->execute();
            
            $this->setCallbackData($data);
            $this->setMessage("Solicitação ".$pSolicitacao." concluída com sucesso.");

        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

}
