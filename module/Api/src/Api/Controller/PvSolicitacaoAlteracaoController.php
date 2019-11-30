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

    public function listarletrasdescontoAction()
    {   
        $data = array();
        
        try {

            $pEmp = $this->params()->fromQuery('emp',null);

            if(!$pEmp){
                throw new \Exception('Parâmetros não informados.');
            }

            $em = $this->getEntityManager();
            
            $sql = "
                select em.apelido as emp, 
                        dl.id_desconto_letra, 
                        dl.perc_desconto as valor,
                        dl.descricao as letra_descricao,
                        dl.id_desconto_letra || ' ' || dl.perc_desconto as letra
                from ms.tb_desconto_letra dl, ms.empresa em 
                where dl.id_empresa = em.id_empresa
                    and em.apelido = ?
                order by valor asc
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(1, $pEmp);

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

    public function listarempresasAction()
    {   
        $data = array();
        
        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $em = $this->getEntityManager();
            
            if($usuario->empresa === 'EC'){
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
            }

            if($usuario->empresa !== 'EC'){
                $sql = "
                    select id_empresa, apelido as nome from ms.empresa 
                     where id_matriz = 1 
                       and apelido = '".$usuario->empresa."'
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

    public function simularprecoAction()
    {   
        $data = array();
        
        try {

            $pEmp = $this->params()->fromQuery('emp',null);

            if(!$pEmp){
                throw new \Exception('Empresa não informada.');
            }

            $pProduto = $this->params()->fromQuery('produto',null);

            if(!$pProduto){
                throw new \Exception('Produto não informada.');
            }

            $pPreco = (float) str_replace(",", ".", $this->params()->fromQuery('preco',null));
            
            if(!$pPreco){
                throw new \Exception('Preço não informada.');
            }

            $pDescontoLetra = $this->params()->fromQuery('descontoLetra',null);
            $pDescontoPerc = $this->params()->fromQuery('descontoPerc',null);
            if($pDescontoPerc === '') $pDescontoPerc = 'desconto_perc';
            
            $em = $this->getEntityManager();

            // echo "
            //     ".($pDescontoLetra ? "'".$pDescontoLetra."'" : "desconto_letra")." as ndesconto_letra,
            //     ".($pDescontoPerc ? $pDescontoPerc : "desconto_perc")." as ndesconto_perc,  
            // "; exit;
            
            $sql = "
                     select emp, cod_item as codigo,
                            descricao,
                            nvl(icms,0)+nvl(pis_cofins,0) as imposto, 
                            icms, pis_cofins, round(custo_unitario,2) as custo,
                            nvl(comissao,0) as comissao, markup, preco, 
                                            
                            desconto_letra,
                            desconto_perc,
                    
                            -- Atual
                            --( preco - custo_unitario - (((nvl(icms,0)+nvl(pis_cofins,0)+nvl(comissao,0))/100)*preco) ) as lucro_unitario,
                            round((( preco - custo_unitario - (((nvl(icms,0)+nvl(pis_cofins,0)+nvl(comissao,0))/100)*preco) ) / preco) * 100,2) as mb,
                            
                            round((( (preco*(1-(nvl(desconto_perc,0)/100))) - custo_unitario - (((nvl(icms,0)+nvl(pis_cofins,0))/100)* ( (preco*(1-(nvl(desconto_perc,0)/100))) *(1-(nvl(desconto_perc,0)/100))) ) ) / (preco*(1-(nvl(desconto_perc,0)/100))) ) * 100,2) as mb_min,
                            
                            $pPreco as npreco,	
                            round(($pPreco/custo_unitario)*100,2) - 100 as nmarkup,

                            --( $pPreco - custo_unitario - (((nvl(icms,0)+nvl(pis_cofins,0)+nvl(comissao,0))/100)* $pPreco ) ) as nlucro_unitario,
                            round(xpv_get_preco_margem($pPreco, custo_unitario, nvl(icms,0)+nvl(pis_cofins,0)+nvl(comissao,0)), 2) as nmb,
                            
                            " . ( $pDescontoLetra ? "'".$pDescontoLetra."'" : "desconto_letra" ) . " as ndesconto_letra,
                            " . $pDescontoPerc . " as ndesconto_perc, 
                            
                            round(xpv_get_preco_margem($pPreco*(1-(nvl($pDescontoPerc,0)/100)), custo_unitario, nvl(icms,0)+nvl(pis_cofins,0)+nvl(comissao,0)), 2) as nmb_min

                    from ( select em.apelido as emp,
                                    i.cod_item||c.descricao as cod_item,
                                    i.descricao,
                                    ace.acessorio as acessorio,
                                    nvl(ace.icms,0) as icms,
                                    nvl(ic.aliq_pis,0)+nvl(ic.aliq_cofins,0) as pis_cofins,
                                    round(mkp.comissao,4) as comissao,
                                    round(mkp.markup,4) as markup,
                                    round(mkp.preco,4) as preco,
                                    
                                    mkp.letra_desconto as desconto_letra,
                                    mkp.perc_desconto as desconto_perc,
                                    
                                    round(e.custo_contabil,4) as custo_unitario
                                                    
                                    -- Custo
                                    -- Impostos
                                                    
                                    -- Preco Atual
                                    -- Mb Atual
                                                    
                                    -- Preco Resultante
                                    -- Mb Resultante
                                                    
                                    -- Comissão
                                    -- Margem de Contribuição
                                                    
                            from ms.tb_estoque e,
                                ms.empresa em,
                                ms.tb_item_categoria ic,
                                ms.tb_item i,
                                ms.tb_categoria c,
                                    
                                ( select a.id_empresa, a.id_item, a.id_categoria, a.preco_venda as preco, a.markup,
                                            a.perc_comissao_gerente as comissao,
                                            a.margem_maxima_markup, a.id_desconto_letra as letra_desconto, b.perc_desconto
                                        from ms.tb_tab_preco_valor a, ms.tb_desconto_letra b
                                        where a.id_empresa = b.id_empresa
                                        and a.id_desconto_letra = b.id_desconto_letra(+)
                                        and (a.id_empresa, a.id_tab_preco) in (select id_empresa, valor from ms.param_empresa
                                                                                where id_param = 'TAB_PRECO_PADRAO') ) mkp,
                                    
                                (select e.id_empresa, e.id_item, e.id_categoria,
                                            cp.gerar_preco_venda,
                                            cp.acessorio,
                                            ( case when e.id_empresa = 23 and nvl(st.st,'N') = 'S' then 0
                                                    when e.id_empresa = 23 and nvl(st.st,'N') = 'N' then 17
                                                    else cp.icms end ) as icms
                                        from ms.tb_estoque e,
                                            (select id_empresa, id_item, id_categoria,
                                                    eh_acessorio as acessorio,
                                                    gerar_preco_venda,
                                                    (case when eh_acessorio = 'S' then 17 end) as icms
                                                from ms.tb_item_categoria_param) cp,
                                            tb_item_icms_st st
                                    where e.id_empresa = cp.id_empresa(+)
                                        and e.id_item = cp.id_item(+)
                                        and e.id_categoria = cp.id_categoria(+)
                                        and e.id_empresa = st.id_empresa(+)
                                        and e.id_item = st.id_item(+)
                                        and e.id_categoria = st.id_categoria(+)) ace,
                                    
                                pricing.vw_produto_restricao pr 
                                    
                            where e.id_item = ic.id_item
                            and e.id_categoria = ic.id_categoria
                            and e.id_item = i.id_item
                            and e.id_categoria = c.id_categoria
                            and e.id_empresa = em.id_empresa
                                            
                            -- Markup
                            and e.id_empresa = mkp.id_empresa
                            and e.id_item = mkp.id_item
                            and e.id_categoria = mkp.id_categoria
                                    
                            -- Acess?rio
                            and e.id_empresa = ace.id_empresa(+)
                            and e.id_item = ace.id_item(+)
                            and e.id_categoria = ace.id_categoria(+)
                                    
                            -- Restri??o
                            and e.id_empresa = pr.id_empresa(+)
                            and e.id_item = pr.id_item(+)
                            and e.id_categoria = pr.id_categoria(+)
                                    
                            and i.cod_item||c.descricao = :produto
                            and em.apelido = :emp )  
            ";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':emp', $pEmp);
            $stmt->bindParam(':produto', $pProduto);

            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('custo', new ValueStrategy);
            $hydrator->addStrategy('imposto', new ValueStrategy);
            $hydrator->addStrategy('icms', new ValueStrategy);
            $hydrator->addStrategy('pis_cofins', new ValueStrategy);
            $hydrator->addStrategy('comissao', new ValueStrategy);
            $hydrator->addStrategy('markup', new ValueStrategy);
            $hydrator->addStrategy('preco', new ValueStrategy);
            $hydrator->addStrategy('lucro_unitario', new ValueStrategy);
            $hydrator->addStrategy('desconto_perc', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $hydrator->addStrategy('mb_min', new ValueStrategy);
            $hydrator->addStrategy('nmarkup', new ValueStrategy);
            $hydrator->addStrategy('npreco', new ValueStrategy);
            $hydrator->addStrategy('nmb', new ValueStrategy);
            $hydrator->addStrategy('nmb_min', new ValueStrategy);
            $hydrator->addStrategy('ndesconto_perc', new ValueStrategy);
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
                        decode(c.id_solicitacao_status,
                               1,'Solicitação' || ' de ' || o.preco_de || ' para ' || o.preco_para,
                               2,s.descricao||' '||c.comentario,
                               3,'Alterada' || ' de ' || o.preco_de || ' para ' || o.preco_para,
                               s.descricao || ' ' || c.comentario) as mensagem
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
                     and rownum <= 10
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
            $pMarkup = str_replace(",", ".", $this->params()->fromPost('markup',null));
            $pPreco = str_replace(",", ".", $this->params()->fromPost('preco',null));
            $pMargem = str_replace(",", ".", $this->params()->fromPost('margem',null));

            $pComentario = $this->params()->fromPost('comentario',null);

            if(!$pSolicitacao){
                throw new \Exception('Solicitação não informada.');
            }

            $conn = $this->getConnection();

            $sql = "call pkg_xpv_solicitacaoalt.aprovar(:solicitacao, :usuario, :comentario, :markup, :preco, :margem)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':solicitacao', $pSolicitacao);
            $stmt->bindParam(':usuario', $pUsuario);
            $stmt->bindParam(':comentario', $pComentario);
            $stmt->bindParam(':markup', $pMarkup);
            $stmt->bindParam(':preco', $pPreco);
            $stmt->bindParam(':margem', $pMargem);
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
            $pMarkup = str_replace(",", ".", $this->params()->fromPost('markup',null));
            $pPreco = str_replace(",", ".", $this->params()->fromPost('preco',null));
            $pMargem = str_replace(",", ".", $this->params()->fromPost('margem',null));
            $pComentario = $this->params()->fromPost('comentario',null);

            if(!$pSolicitacao){
                throw new \Exception('Solicitação não informada.');
            }

            $conn = $this->getConnection();

            $sql = "call pkg_xpv_solicitacaoalt.alterar(:solicitacao, :usuario, :comentario, :markup, :preco, :margem)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':solicitacao', $pSolicitacao);
            $stmt->bindParam(':usuario', $pUsuario);
            $stmt->bindParam(':comentario', $pComentario);
            $stmt->bindParam(':markup', $pMarkup);
            $stmt->bindParam(':preco', $pPreco);
            $stmt->bindParam(':margem', $pMargem);
            $result = $stmt->execute();
            
            $this->setCallbackData($data);
            $this->setMessage("Solicitação alterada com sucesso.");

        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

}
