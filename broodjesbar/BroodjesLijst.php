<?php
declare(strict_types=1);
require_once 'Broodje.php';
require_once 'Connection.php';

class BroodjesLijst {
    private string $dbConn;
    private string $dbUsername;
    private string $dbPassword;

    public function __construct() {
        $connection = new Connection();
        $this->dbConn = $connection->getDbConn();
        $this->dbUsername = $connection->getDbUsername();
        $this->dbPassword = $connection->getDbPassword();
    }    
    public function getList() : array {
        $sql = "SELECT id, naam, omschrijving, prijs, image FROM broodjes ORDER BY naam";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);
        $resultSet = $dbh->query($sql);

        $lijst= array();
        foreach ($resultSet as $rij) {
            $bestelling = new Broodje((int) $rij["id"], (string) $rij["naam"], (string) $rij["omschrijving"],
            (float) $rij["prijs"], (string) $rij["image"]);
            array_push($lijst, $bestelling);
        }
        $dbh = null;
        return $lijst;
    }
    public function getBroodjeById(int $id) : Broodje {
        $sql = "SELECT id, naam, omschrijving, prijs, image FROM broodjes WHERE id = :id";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);        

        $stmt = $dbh->prepare($sql);
        $stmt->execute(array(':id' => $id));
        $rij = $stmt->fetch(PDO::FETCH_ASSOC);
        $broodje = new Broodje((int)$id, (string) $rij["naam"], (string) $rij["omschrijving"], (float) $rij["prijs"], (string) $rij["image"]);

        $dbh = null;
        return $broodje;
    }
    public function createBroodje(Broodje $broodje) {
        $sql = "INSERT INTO broodjes (naam, omschrijving, prijs, image) VALUES (:naam, :omschrijving, :prijs, :image)";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);        
        $stmt = $dbh->prepare($sql);        
        $stmt->execute(array(
            ':naam' => $broodje->getNaam(),
            ':omschrijving' => $broodje->getOmschrijving(),            
            ':prijs' => $broodje->getPrijs(),
            ':image' => $broodje->getImage()
        ));
        
        $dbh = null;
    } 
    public function deleteBroodje(int $id) {
        $sql = "delete from broodjes where id = :id" ;
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);
        $stmt = $dbh->prepare($sql);
        $stmt->execute(array(':id' => $id));
        $dbh = null;
    }  
}