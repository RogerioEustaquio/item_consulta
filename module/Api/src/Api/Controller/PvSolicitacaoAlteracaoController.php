<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Zend\Db\ResultSet\HydratingResultSet;
use Core\Stdlib\StdClass;
use Core\Hydrator\ObjectProperty;
use Core\Hydrator\Strategy\ValueStrategy;
use Core\Mvc\Controller\AbstractRestfulController;

class PvSolicitacaoAlteracaoController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }

    public function testeAction(){
        $ip = null;

        if (getenv('HTTP_CLIENT_IP')) {
            $ip = getenv('HTTP_CLIENT_IP');
        //Utilizo para verificar se o usuário está utilizando um proxy ou não.
        } else if(getenv('HTTP_X_FORWARDED_FOR')) {
            $ip = getenv('HTTP_X_FORWARDED_FOR');
        } else if(getenv('HTTP_X_FORWARDED')) {
            $ip = getenv('HTTP_X_FORWARDED');
        } else if(getenv('HTTP_FORWARDED_FOR')) {
            $ip = getenv('HTTP_FORWARDED_FOR');
        } else if(getenv('HTTP_FORWARDED')) {
            $ip = getenv('HTTP_FORWARDED');
        //O endereço IP de onde o usuário está visualizado a página atual.
        } else if(getenv('REMOTE_ADDR')) {
            $ip = getenv('REMOTE_ADDR');
        } else {
            $ip = 'UNKNOWN';
        }

        echo $ip;
        exit;
    }

    public function listarempresasAction()
    {   
        $data = array();
        
        try {

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
                 select s.id_solicitacao, 
                        e.apelido as emp, i.cod_item||c.descricao as codigo, 
                        i.descricao, m.descricao as marca, s.usuario_solicitacao, 
                        to_char(s.data_solicitacao, 'DD/MM/RRRR HH24:MI:SS') as data_solicitacao,
                        s.id_solicitacao_status, ss.descricao as status, 
                        s.preco_de, s.preco_para, s.preco_confirmado
                   from pricing.xpv_solicitacaoalt s,
                        pricing.xpv_solicitacaoalt_status ss,
                        ms.empresa e,
                        ms.tb_item i,
                        ms.tb_categoria c,
                        ms.tb_item_categoria ic,
                        ms.tb_marca m
                where s.id_solicitacao_status = ss.id_solicitacao_status
                    and s.id_empresa = e.id_empresa
                    and s.id_item = i.id_item
                    and s.id_categoria = c.id_categoria
                    and s.id_item = ic.id_item
                    and s.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca
            ";

            // Filter
            // Todas as solicitações para o escritório central
            if($pEmp !== 'EC')
            $sql .= " and e.apelido = ? ";

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
            $hydrator->addStrategy('preco_de', new ValueStrategy);
            $hydrator->addStrategy('preco_para', new ValueStrategy);
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

    public function listarcomentariosAction()
    {   
        $data = array();
        
        try {

            $pSolicitacao = $this->params()->fromQuery('solicitacao',null);

            $em = $this->getEntityManager();
            
            $sql = "
                 select o.id_solicitacao,
                        o.preco_de,
                        o.preco_para,
                        o.preco_confirmado,
                        o.data_solicitacao,
                        o.usuario_solicitacao,
                        o.data_alteracao,
                        o.usuario_alteracao,
                        c.id_comentario, 
                        c.id_solicitacao_status,
                        c.data as data_comentario, 
                        to_char(c.data, 'DD/MM/RRRR HH24:MI:SS') as data, 
                        c.usuario, 
                        c.comentario,
                        decode(c.id_solicitacao_status,1,'Solicitação' || ' de ' || o.preco_de || ' para ' || o.preco_para, s.descricao) || ' ' || c.comentario as mensagem
                   from pricing.xpv_solicitacaoalt_comentario c, 
                        pricing.xpv_solicitacaoalt_status s,
                        pricing.xpv_solicitacaoalt o
                  where c.id_solicitacao_status = s.id_solicitacao_status
                    and c.id_solicitacao = o.id_solicitacao
                    and c.id_solicitacao = ?
                  order by data_comentario desc
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(1, $pSolicitacao);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            // $hydrator->addStrategy('data_solicitacao', new ValueStrategy);
            // $hydrator->addStrategy('preco_de', new ValueStrategy);
            // $hydrator->addStrategy('preco_para', new ValueStrategy);
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
                  select e.apelido as emp, i.cod_item||c.descricao as cod_item, i.descricao, m.descricao as marca, pv.preco 
                    from ms.tb_estoque es,
                         ms.empresa e, 
                         ms.tb_item_categoria ic,
                         ms.tb_item i,
                         ms.tb_categoria c,
                         ms.tb_marca m,
                         
                         (select id_empresa, id_item, id_categoria, preco_venda as preco  
                            from ms.tb_tab_preco_valor where id_tab_preco = 1) pv
                                           
                   where es.id_empresa = e.id_empresa
                     and es.id_item = ic.id_item
                     and es.id_categoria = ic.id_categoria
                     and es.id_item = i.id_item
                     and es.id_categoria = c.id_categoria
                     and ic.id_marca = m.id_marca
                     and es.id_empresa = pv.id_empresa
                     and es.id_item = pv.id_item
                     and es.id_categoria = pv.id_categoria
                     and e.apelido = ?
                     and i.cod_item||c.descricao like upper('%$pCod%')
                     and rownum <= 5
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(1, $pEmp);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            // $hydrator->addStrategy('estoque', new ValueStrategy);
            // $hydrator->addStrategy('preco', new ValueStrategy);
            // $hydrator->addStrategy('bonus', new ValueStrategy);
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
            $pPrecoIdeal = str_replace(",", ".", $this->params()->fromPost('preco',null));
            $pComentario = $this->params()->fromPost('comentario',null);

            // print_r(array(
            //     $pUsuario,
            //     $pEmp,
            //     $pCodItem,
            //     $pPrecoIdeal,
            //     $pComentario
            // ));
            
            if(!$pEmp || !$pCodItem){
                throw new \Exception('Erro ao salvar os dados.');
            }

            if(!$pComentario){
                throw new \Exception('Comentário não informado.');
            }

            $conn = $this->getConnection();

            $sql = "call pkg_xpv_solicitacaoalt.inserir(:emp, :cod_item, :preco_ideal, :usuario, :comentario)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':emp', $pEmp);
            $stmt->bindParam(':cod_item', $pCodItem);
            $stmt->bindParam(':preco_ideal', $pPrecoIdeal);
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

    public function aprovarsolicitacaoAction()
    {   
        $data = array();
        
        try {
            
            $pUsuario = 'EVERTON';
            $pSolicitacao = $this->params()->fromPost('solicitacao',null);
            $pComentario = $this->params()->fromPost('comentario',null);

            if(!$pSolicitacao){
                throw new \Exception('Solicitação não informada.');
            }

            $conn = $this->getConnection();

            $sql = "call pkg_xpv_solicitacaoalt.aprovar(:solicitacao, :usuario, :comentario)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':solicitacao', $pSolicitacao);
            $stmt->bindParam(':usuario', $pUsuario);
            $stmt->bindParam(':comentario', $pComentario);
            $result = $stmt->execute();
            
            $this->setCallbackData($data);
            $this->setMessage("Solicitação aprovada com sucesso.");

        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function reprovarsolicitacaoAction()
    {   
        $data = array();
        
        try {
            
            $pUsuario = 'EVERTON';
            $pSolicitacao = $this->params()->fromPost('solicitacao',null);
            $pComentario = $this->params()->fromPost('comentario',null);

            if(!$pSolicitacao){
                throw new \Exception('Solicitação não informada.');
            }

            $conn = $this->getConnection();

            $sql = "call pkg_xpv_solicitacaoalt.reprovar(:solicitacao, :usuario, :comentario)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':solicitacao', $pSolicitacao);
            $stmt->bindParam(':usuario', $pUsuario);
            $stmt->bindParam(':comentario', $pComentario);
            $result = $stmt->execute();
            
            $this->setCallbackData($data);
            $this->setMessage("Solicitação reprovada com sucesso.");

        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function alterarsolicitacaoAction()
    {   
        $data = array();
        
        try {
            
            $pUsuario = 'EVERTON';
            $pSolicitacao = $this->params()->fromPost('solicitacao',null);
            $pConfirmado = str_replace(",", ".", $this->params()->fromPost('precoConfirmado',null));
            $pComentario = $this->params()->fromPost('comentario',null);

            if(!$pSolicitacao){
                throw new \Exception('Solicitação não informada.');
            }

            $conn = $this->getConnection();

            $sql = "call pkg_xpv_solicitacaoalt.alterar(:solicitacao, :usuario, :comentario, :precoConfirmado)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':solicitacao', $pSolicitacao);
            $stmt->bindParam(':usuario', $pUsuario);
            $stmt->bindParam(':comentario', $pComentario);
            $stmt->bindParam(':precoConfirmado', $pConfirmado);
            $result = $stmt->execute();
            
            $this->setCallbackData($data);
            $this->setMessage("Solicitação alterada com sucesso.");

        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

}
