<?php
declare(strict_types=1);
require_once 'Connection.php';

class Bestelling {
    private int $id;
    private int $broodjeId;
    private int $userId;
    private string $datum;
    private float $prijs;
    private int $status;
    private int $betaald;

    private string $dbConn;
    private string $dbUsername;
    private string $dbPassword;

    public function __construct(int $id, int $broodjeId, int $userId, string $datum, float $prijs, int $status, int $betaald) {
        $this->id = $id;
        $this->broodjeId = $broodjeId;
        $this->userId = $userId;
        $this->datum = $datum;
        $this->prijs = $prijs;
        $this->status = $status;
        $this->betaald = $betaald;

        $connection = new Connection();
        $this->dbConn = $connection->getDbConn();
        $this->dbUsername = $connection->getDbUsername();
        $this->dbPassword = $connection->getDbPassword();
        
    }
    public function getId() : int {
        return $this->id;
    }
    public function getBroodjeId() : int {
        return $this->broodjeId;
    }
    public function getUserId() : int {
        return $this->userId;
    }
    public function getDatum() : string {
        return $this->datum;
    }
    public function getPrijs() : float {
        return $this->prijs;
    }
    public function getSatus() : int {
        return $this->status;
    }
    public function getStatusNaam() : string {        
            $sql = "SELECT omschrijving FROM bestelstatus WHERE id = :id";
            $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);
            $stmt = $dbh->prepare($sql);
            $stmt->execute(array(':id' => $this->status));
            $resultSet = $stmt->fetch(PDO::FETCH_ASSOC);           
            $statusNaam = $resultSet["omschrijving"];
            
            $dbh = null;
            return $statusNaam;
    }  
    public function getBetaald() : string {        
        return $this->betaald === 0 ? 'Nee' : 'Ja';        
    }  
}