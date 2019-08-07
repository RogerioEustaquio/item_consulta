<?php
namespace Core\Service;
use Doctrine\ORM\EntityManager;

class AbstractService 
{
    /**
     * @var EntityManager
     */
    protected $em;
    
    /**
     * Constructor
     * @param EntityManager $entityManager
     */
    public function __construct(EntityManager $entityManager)
    {
        $this->em = $entityManager;
    }
    
    /*
     * Return Doctrine Entity Manager
     * @return EntityManager
     */
    public function getEm()
    {
        return $this->em;
    }
    
    /*
     * Return Doctrine Entity Manager
     * @return EntityManager
     */
    public function getEntityManager()
    {
        return $this->em;
    }
}
