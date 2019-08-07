<?php
namespace Api\Service;
use Core\Service\AbstractService;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

use Api\Entity\Pessoa;
use Api\Entity\PessoaJuridica;
use Api\Entity\PessoaEndereco;
use Api\Entity\Cliente;
use Api\Entity\Credenciado;
use Api\Entity\PessoaTelefone;

class ClienteService extends AbstractService
{
    /**
     * @everton não excluir o cliente, apenas desativar ele
     * @param type $ids
     * @return type
     * @throws \Api\Service\Exception
     */
    public function removerClientes($ids){
        $this->em->getConnection()->beginTransaction();
        
        $removidos = array();
        
        try {
            foreach($ids as $id){
                $hydrator = new DoctrineHydrator($this->em);
                $cliente = $hydrator->hydrate(array('id' => $id), new Cliente());
                $this->em->remove($cliente);
                $this->em->flush();
                
                $removidos[] = $id;
            }
            
            $this->em->getConnection()->commit();
        } catch (Exception $e) {
            $this->em->getConnection()->rollBack();
            throw $e;
        }
        
        return $removidos;
    }
    
    public function cadastrarClientePj($params){
        $this->em->getConnection()->beginTransaction();
        $hydrator = new DoctrineHydrator($this->em);
        $cliente = null;
        
        try {
            if(!isset($params['credenciado'])){
                throw new \Exception("Credenciado não informado.");
            }    
            
            if(!isset($params['nome'])){
                throw new \Exception("Nome não informado.");
            }
            
            if(!isset($params['cnpj'])){
                throw new \Exception("CNPJ não informado.");
            }
            
            if(!isset($params['inscricaoEstadual'])){
                throw new \Exception("Inscrição estadual não informada.");
            }
            
            // Cadastro da pessoa
            $pessoa = $this->cadastrarPessoa($params);
            
            // Cadastrar a pessoa jurídica
            $pessoaJuridica = $this->cadastrarPessoaJuridica($pessoa, $params);
            
            // Cadastra o cliente com base em um credenciado já informado
            $credenciado = $hydrator->hydrate($params['credenciado'], new Credenciado());
            $cliente = $this->cadastrarCliente($pessoa, $credenciado);
            
            // Cadastro dos endereços
            if(isset($params['enderecos'])){
                foreach($params['enderecos'] as $endereco){
                    $pessoaEndereco = $this->cadastrarEndereco($pessoa, $endereco);
                    $this->em->persist($pessoaEndereco);
                    $this->em->flush();
                    
                    $pessoa->getEnderecos()->add($pessoaEndereco);
                }
            }
            
            // Cadastro dos telefones
            if(isset($params['telefones'])){
                foreach($params['telefones'] as $telefone){
                    $pessoaTelefone = $this->cadastrarTelefone($pessoa, $telefone);
                    $this->em->persist($pessoaTelefone);
                    $this->em->flush();
                }
            }
            
            $this->em->getConnection()->commit();
        } catch (Exception $e) {
            $this->em->getConnection()->rollBack();
            throw $e;
        }
        
        return $cliente;
    }
    
    public function update(){
        
    }
    
    public function delete(){
        
    }
    
    public function cadastrarPessoa($params)
    {
        $pessoa = new Pessoa();
        
        try {
            $this->em->getConnection()->beginTransaction();
            
                $maxId = $this->em->createQueryBuilder()
                                                ->select('MAX(p.id)')->from('Api\Entity\Pessoa', 'p')
                                                ->getQuery()->getSingleScalarResult();
                
                $pessoa->setId(($maxId ? $maxId+1 : 1));
                $pessoa->setNome($params['nome']);
                $pessoa->setDataCadastro(new \DateTime());
                
                $this->em->persist($pessoa);
                $this->em->flush();
            
            $this->em->getConnection()->commit();
            
        } catch (Exception $e) {
            $this->em->getConnection()->rollBack();
            throw $e;
        }
        
        return $pessoa;
    }
    
    public function cadastrarEndereco(Pessoa $pessoa, $params)
    {
        $hydrator = new DoctrineHydrator($this->em);
        $pessoaEndereco = new PessoaEndereco();
        
        try {
            $this->em->getConnection()->beginTransaction();
            
                $maxIdPessoaEndereco = $this->em->createQueryBuilder()
                                                ->select('MAX(e.id)')->from('Api\Entity\PessoaEndereco', 'e')
                                                ->getQuery()->getSingleScalarResult();

                $params['id'] = ($maxIdPessoaEndereco ? $maxIdPessoaEndereco+1 : 1);
                $params['pessoa'] = $pessoa;
                $pessoaEndereco = $hydrator->hydrate($params, $pessoaEndereco);
                
                $this->em->persist($pessoaEndereco);
                $this->em->flush();
            
            $this->em->getConnection()->commit();
            
        } catch (Exception $e) {
            $this->em->getConnection()->rollBack();
            throw $e;
        }
        
        return $pessoaEndereco;
    }
    
    public function cadastrarTelefone(Pessoa $pessoa, $params)
    {
        $hydrator = new DoctrineHydrator($this->em);
        $pessoaTelefone = new PessoaTelefone();
        
        try {
            $this->em->getConnection()->beginTransaction();
            
                $maxIdPessoaTelefone = $this->em->createQueryBuilder()
                                                ->select('MAX(e.id)')->from('Api\Entity\PessoaTelefone', 'e')
                                                ->getQuery()->getSingleScalarResult();

                $params['id'] = ($maxIdPessoaTelefone  ? $maxIdPessoaTelefone +1 : 1);
                $params['pessoa'] = $pessoa;
                $pessoaTelefone = $hydrator->hydrate($params, $pessoaTelefone);
                
                $this->em->persist($pessoaTelefone);
                $this->em->flush();
            
            $this->em->getConnection()->commit();
            
        } catch (Exception $e) {
            $this->em->getConnection()->rollBack();
            throw $e;
        }
        
        return $pessoaTelefone;
    }
    
    public function cadastrarPessoaJuridica(Pessoa $pessoa, $params){
        $pessoaJuridica = new PessoaJuridica();
        
        try {
            $this->em->getConnection()->beginTransaction();
                
                $findRow = $this->em->getRepository('Api\Entity\PessoaJuridica')->findOneBy(array('cnpj' => $params['cnpj']));
                if(count($findRow) > 0){
                    throw new \Exception("Cnpj " . $params['cnpj'] . " já está cadastrado no sistema.");
                }
                
                $pessoaJuridica->setPessoa($pessoa);
                $pessoaJuridica->setCnpj($params['cnpj']);
                $pessoaJuridica->setInscricaoEstadual($params['inscricaoEstadual']);
                $pessoaJuridica->setRazaoSocial($params['razaoSocial']);
                
                $this->em->persist($pessoaJuridica);
                $this->em->flush();
            
            $this->em->getConnection()->commit();
            
        } catch (Exception $e) {
            $this->em->getConnection()->rollBack();
            throw $e;
        }
        
        return $pessoaJuridica;
    }
    
    public function cadastrarCliente(Pessoa $pessoa, Credenciado $credenciado){
        
        try {
            $this->em->getConnection()->beginTransaction();
            
                $maxIdCliente = $this->em->createQueryBuilder()
                                          ->select('MAX(a.id)')->from('Api\Entity\Cliente', 'a')
                                          ->getQuery()->getSingleScalarResult();
                
                $cliente = new Cliente();
                $cliente->setId(($maxIdCliente ? $maxIdCliente+1 : 1));
                $cliente->setPessoa($pessoa);
                $cliente->setCredenciado($credenciado);
                $cliente->setDataCadastro(new \DateTime());
                
                $this->em->persist($cliente);
                $this->em->flush();
//            
//                $query = $this->em->createQueryBuilder()
//                        ->select('p')
//                        ->from('Api\Entity\Cliente', 'p')
//                        ->where('p.id = ?1')
//                        ->setParameter(1, $maxIdCliente+1)
//                        ->getQuery();
//            
//                print_r($cliente->getPessoa()->getId());
                
            $this->em->getConnection()->commit();
            
        } catch (Exception $e) {
            $this->em->getConnection()->rollBack();
            throw $e;
        }
        
        return $cliente;
    }
    
    public function cadastrarCredenciado(Pessoa $pessoa){
        $credenciado = new Credenciado();
        
        try {
            $this->em->getConnection()->beginTransaction();
            
                $maxId = $this->em->createQueryBuilder()
                                          ->select('MAX(c.id)')->from('Api\Entity\Credenciado', 'c')
                                          ->getQuery()->getSingleScalarResult();
                
                $credenciado->setId(($maxId ? $maxId+1 : 1));
                $credenciado->setPessoa($pessoa);
                $credenciado->setDataCredenciamento(new \DateTime());
                
                $this->em->persist($credenciado);
                $this->em->flush();
            
            $this->em->getConnection()->commit();
            
        } catch (Exception $e) {
            $this->em->getConnection()->rollBack();
            throw $e;
        }
        
        return $credenciado;
    }
    
}