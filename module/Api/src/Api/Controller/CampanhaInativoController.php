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
                    and p.descricao like 'Campanha Inativos'
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

    public function exportarparaexcelAction()
    { 
        $session = $this->SessionPlugin()->getSession();
		
        $sql = "
             select i.cod_item||c.descricao as cod_item, i.descricao, m.descricao as marca, 
                    es.estoque, pi.perc_promocao as preco, if.part_number, Trim(i.aplicacao) as aplicacao
                from ms.tb_promocao p, ms.tb_promocao_item pi, ms.tb_item i, ms.tb_categoria c, ms.empresa e,
                        ms.tb_item_categoria ic, ms.tb_marca m, ms.tb_estoque es,
                        (select id_item, id_categoria, part_number
                        from ms.tb_item_fabricante
                        where part_number_cotacao = 'S'
                        group by id_item, id_categoria, part_number) if 
                where p.id_empresa = pi.id_empresa
                    and p.id_promocao = pi.id_promocao
                    and p.id_empresa = e.id_empresa
                    and pi.id_item = i.id_item
                    and pi.id_categoria = c.id_categoria
                    and pi.id_item = ic.id_item
                    and pi.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca 
                    and pi.id_empresa = es.id_empresa
                    and pi.id_item = es.id_item
                    and pi.id_categoria = es.id_categoria
                    and pi.id_item = if.id_item(+)
                    and pi.id_categoria = if.id_categoria(+)
                    and e.apelido = ?
                    and es.estoque > 0
                    and p.descricao = 'Campanha Inativos'
        ";

        $em = $this->getEntityManager();
        $conn = $em->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(1, $this->params()->fromQuery('empresa',null));
        $stmt->execute();
        $results = $stmt->fetchAll();

        $hydrator = new ObjectProperty;
        $hydrator->addStrategy('estoque', new ValueStrategy);
        $hydrator->addStrategy('preco', new ValueStrategy);
        $stdClass = new StdClass;
        $resultSet = new HydratingResultSet($hydrator, $stdClass);
        $resultSet->initialize($results);

        $data = array();
        foreach ($resultSet as $row) {
            $data[] = $hydrator->extract($row);
        }

        $sm = $this->getEvent()->getApplication()->getServiceManager();
        $excelService = $sm->get('ExcelService');
        $phpExcel = $excelService->createPHPExcelObject('.\data\TplCampanhaInativosProdutos.xlsx');

        if(isset($session['info'])){
            $user = $session['info'];
            $phpExcel->getActiveSheet()->setCellValue('C3', (isset($user['nome']) ? $user['nome'] : 'Digite seu nome') );
            $phpExcel->getActiveSheet()->setCellValue('C4', (isset($user['email']) ? $user['email'] : 'Digite seu email') );
        }
		else {
			exit;
		}
		
        $baseRow = 8;

        foreach($data as $i => $row){
            $rowLine = $baseRow + $i+1;

            $teste = null;

            
                $teste = $row['aplicacao'];

                $phpExcel->getActiveSheet()->setCellValue('B'.$rowLine, $row['codItem'])
                                        ->setCellValue('C'.$rowLine, $row['descricao'])
                                        ->setCellValue('D'.$rowLine, $row['marca'])
                                        ->setCellValue('E'.$rowLine, $row['estoque'])
                                        ->setCellValue('F'.$rowLine, $row['preco'])
                                        ->setCellValue('G'.$rowLine, $row['partNumber'])
                                        //->setCellValueExplicit('H'.$rowLine, $row['aplicacao'], \PHPExcel_Cell_DataType::TYPE_STRING)
                                        ->setCellValue('H'.$rowLine, ' ');
                                        // ->setCellValueExplicit('H'.$rowLine, preg_replace('/\\s\\s+/', ' ', $row['aplicacao'])), /PHPExcel_Cell_DataType::TYPE_STRING);
                                            //   ->setCellValue('E'.$row, '=C'.$row.'*D'.$row);

        }

        $styleArray = [
            'borders' => [
                'allborders' => [
                    'style' => \PHPExcel_Style_Border::BORDER_THIN,
                    'color' => ['rgb' => 'a6a6a6'],
                ],
            ],
        ];
        
        $phpExcel->getActiveSheet()->getStyle('B9:G'.$rowLine)->applyFromArray($styleArray);
	
        $objWriter = $sm->get('ExcelService')->createWriter($phpExcel, 'Excel5');
        // $objWriter->save(getcwd() . '/teste.xls');

        // echo date('H:i:s') , " Write to Excel5 format";
        // $objWriter = $sm->get('ExcelService')->createWriter($phpExcel, 'Excel5');
        // $objWriter->save(str_replace('.php', '.xls', __FILE__));
        // echo date('H:i:s') , " File written to " , str_replace('.php', 'data/teste.xls', pathinfo(__FILE__, PATHINFO_BASENAME));
        // // Echo memory peak usage
        // echo date('H:i:s') , " Peak memory usage: " , (memory_get_peak_usage(true) / 1024 / 1024) , " MB";
        // // Echo done
        // echo date('H:i:s') , " Done writing file";
        // echo 'File has been created in ' , getcwd();

        //echo 'listaritensnoexcelAction';
        // exit;
        $response = $excelService->createHttpResponse($objWriter, 200, [
            'Pragma' => 'public',
            'Cache-control' => 'must-revalidate, post-check=0, pre-check=0',
            'Cache-control' => 'private',
            'Expires' => '0000-00-00',
            'Content-Type' => 'application/vnd.ms-excel; charset=utf-8',
            'Content-Disposition' => 'attachment; filename=' . 'JS Peças - Produtos em oferta.xls',
        ]);

        return $response;
    }
    
}
