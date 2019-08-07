<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Core\Mvc\Controller\AbstractRestfulController;

class ItemDemandaController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }
    
    /*
     * Lista as quantidades compradas nos últimos 12 meses
     */
    public function listarqtdscompradasAction()
    {   
        $data = array();
        
        try {
            $em = $this->getEntityManager();
            
            $sql = "
                select em.apelido as empresa, i.cod_item||c.descricao as cod_item,
                       trunc(c.data_entrada, 'MM') as data,
                       sum(ci.qtde - nvl(ci.qtde_dev, 0)) as total
                  from ms.cp_compra_item ci, ms.cp_compra c, 
                       ms.empresa em, ms.tb_item i, ms.tb_categoria c
                 where c.id_empresa = ci.id_empresa
                   and c.id_compra = ci.id_compra
                   and c.id_empresa = em.id_empresa
                   and ci.id_item = i.id_item
                   and ci.id_categoria = c.id_categoria
                   and c.id_operacao in (1, 14)
                   and trunc(c.data_entrada) >= add_months(trunc(sysdate, 'MM'),-11)
                   and trunc(c.data_entrada, 'MM') <= trunc(sysdate, 'MM')
                   and em.apelido = :empresa
                   and i.cod_item||c.descricao = :coditem
                 group by em.apelido, i.cod_item||c.descricao, trunc(c.data_entrada, 'MM')
                 order by data
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);

            $stmt->bindValue('empresa', $this->params()->fromQuery('empresa',null));
            $stmt->bindValue('coditem', $this->params()->fromQuery('codItem',null));
            $stmt->execute();
            $data = $stmt->fetchAll();
            
        } catch (\Exception $e) {
            $message = $e->getMessage();
        }
        
        $json = new JsonModel($data);
        return $this->getResponseWithHeader()->setContent($json->serialize());
    }
    
    /*
     * Lista as quantidades de notas emitidas nos últimos 12 meses
     */
    public function listarqtdsnotasemitidasAction()
    {   
        $data = array();
        
        try {
            $em = $this->getEntityManager();
            
            
            $sql = "
                select em.apelido as empresa, i.cod_item||c.descricao as cod_item, trunc(vix.data, 'MM') as data,
                       count(distinct vix.numero_nf) as total 
                  from (select trunc(v.data_emissao, 'MM') as data,
                               v.id_empresa,
                               vi.id_item,
                               vi.id_categoria,
                               v.numero_nf
                          from ms.ve_vendas v, ms.ve_vendas_item vi
                         where v.id_empresa = vi.id_empresa
                           and v.id_venda = vi.id_venda
                           and v.id_operacao in (4, 7)
                           and v.status = 'A'
                           and trunc(v.data_emissao) >= add_months(trunc(sysdate, 'MM'),-11)
                           and trunc(v.data_emissao, 'MM') <= trunc(sysdate, 'MM')
                           and (nvl(vi.qtde,0)-nvl(vi.qtde_dev,0)) > 0) vix,
                       ms.empresa em,
                       ms.tb_item i,
                       ms.tb_categoria c
                 where vix.id_empresa = em.id_empresa
                   and vix.id_item = i.id_item
                   and vix.id_categoria = c.id_categoria
                   and em.apelido = :empresa
                   and i.cod_item||c.descricao = :coditem
                 group by em.apelido, i.cod_item||c.descricao, vix.data
                 order by data
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);

            $stmt->bindValue('empresa', $this->params()->fromQuery('empresa',null));
            $stmt->bindValue('coditem', $this->params()->fromQuery('codItem',null));
            $stmt->execute();
            $data = $stmt->fetchAll();
            
        } catch (\Exception $e) {
            $message = $e->getMessage();
        }
        
        $json = new JsonModel($data);
        return $this->getResponseWithHeader()->setContent($json->serialize());
    }
    
    /*
     * Lista as quantidades vendidas nos últimos 12 meses
     */
    public function listarqtdsvendidasAction()
    {   
        $data = array();
        
        try {
            $em = $this->getEntityManager();
            
            
            $sql = "
                select em.apelido as empresa, i.cod_item||c.descricao as cod_item, trunc(vix.data, 'MM') as data,
                       sum(vix.qtde) as total 
                  from (select trunc(v.data_emissao, 'MM') as data,
                               v.id_empresa,
                               vi.id_item,
                               vi.id_categoria,
                               vi.qtde
                          from ms.ve_vendas v, ms.ve_vendas_item vi
                         where v.id_empresa = vi.id_empresa
                           and v.id_venda = vi.id_venda
                           and v.id_operacao in (4, 7)
                           and v.status = 'A'
                           and trunc(v.data_emissao) >= add_months(trunc(sysdate, 'MM'),-11)
                           and trunc(v.data_emissao, 'MM') <= trunc(sysdate, 'MM')

                         union all

                        select trunc(c.data_entrada, 'MM') as data,
                               c.id_empresa,
                               ci.id_item,
                               ci.id_categoria,
                               ci.qtde * -1
                          from ms.cp_compra c,
                               ms.cp_compra_item ci,
                               ms.devolucao_venda_compra d,
                               ms.ve_vendas v
                         where c.id_empresa = ci.id_empresa
                           and c.id_compra = ci.id_compra
                           and ci.id_empresa = d.id_empresa
                           and ci.id_compra = d.id_compra
                           and ci.id_sequencia_item = d.id_seq_compra_item
                           and d.id_venda = v.id_venda
                           and d.id_empresa = v.id_empresa
                           and trunc(c.data_entrada) >= add_months(trunc(sysdate, 'MM'),-11)
                           and trunc(c.data_entrada, 'MM') <= trunc(sysdate, 'MM')
                           and c.status = 'A'
                           and c.id_operacao = 10) vix,
                       ms.empresa em,
                       ms.tb_item i,
                       ms.tb_categoria c
                 where vix.id_empresa = em.id_empresa
                   and vix.id_item = i.id_item
                   and vix.id_categoria = c.id_categoria
                   and em.apelido = :empresa
                   and i.cod_item||c.descricao = :coditem
                 group by em.apelido, i.cod_item||c.descricao, vix.data
                 order by data
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);

            $stmt->bindValue('empresa', $this->params()->fromQuery('empresa',null));
            $stmt->bindValue('coditem', $this->params()->fromQuery('codItem',null));
            $stmt->execute();
            $data = $stmt->fetchAll();
            
        } catch (\Exception $e) {
            $message = $e->getMessage();
        }
        
        $json = new JsonModel($data);
        return $this->getResponseWithHeader()->setContent($json->serialize());
    }
    
    /**
     * Lista a quantidade de clientes compradores nos últimos 12 meses
     */
    public function listarqtdsclientescompradoresAction()
    {   
        $data = array();
        
        try {
            $em = $this->getEntityManager();
            
            
            $sql = "
                select em.apelido as empresa, i.cod_item||c.descricao as cod_item, trunc(vix.data, 'MM') as data,
                       count(distinct vix.id_pessoa) as total 
                  from (select trunc(v.data_emissao, 'MM') as data,
                               v.id_empresa,
                               vi.id_item,
                               vi.id_categoria,
                               v.id_pessoa
                          from ms.ve_vendas v, ms.ve_vendas_item vi
                         where v.id_empresa = vi.id_empresa
                           and v.id_venda = vi.id_venda
                           and v.id_operacao in (4, 7)
                           and v.status = 'A'
                           and trunc(v.data_emissao) >= add_months(trunc(sysdate, 'MM'),-11)
                           and trunc(v.data_emissao, 'MM') <= trunc(sysdate, 'MM')
                           and (nvl(vi.qtde,0)-nvl(vi.qtde_dev,0)) > 0) vix,
                       ms.empresa em,
                       ms.tb_item i,
                       ms.tb_categoria c
                 where vix.id_empresa = em.id_empresa
                   and vix.id_item = i.id_item
                   and vix.id_categoria = c.id_categoria
                   and em.apelido = :empresa
                   and i.cod_item||c.descricao = :coditem
                 group by em.apelido, i.cod_item||c.descricao, vix.data
                 order by data
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);

            $stmt->bindValue('empresa', $this->params()->fromQuery('empresa',null));
            $stmt->bindValue('coditem', $this->params()->fromQuery('codItem',null));
            $stmt->execute();
            $data = $stmt->fetchAll();
            
        } catch (\Exception $e) {
            $message = $e->getMessage();
        }
        
        $json = new JsonModel($data);
        return $this->getResponseWithHeader()->setContent($json->serialize());
    }
    
}
