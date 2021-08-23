<?php
declare(strict_types=1);
require_once 'Bestelling.php';
require_once 'User.php';
require_once 'Connection.php';

class BestellingsLijst {
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
        $sql = "SELECT id, broodjeId, userId, datum, prijs, status, betaald FROM bestellingen ORDER BY datum";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);
        $resultSet = $dbh->query($sql);

        $lijst= array();
        foreach ($resultSet as $rij) {
            $bestelling = new Bestelling((int) $rij["id"], (int) $rij["broodjeId"], (int) $rij["userId"],
            (string) $rij["datum"], (float) $rij["prijs"], (int) $rij["status"], (int) $rij["betaald"]);
            array_push($lijst, $bestelling);
        }
        $dbh = null;        
        return $lijst;
    }
    public function createBestelling(Broodje $broodje, User $user) {        
        $sql = "INSERT INTO bestellingen (broodjeId, userId, datum, prijs, status, betaald) VALUES (:broodjeId, :userId, :datum, :prijs, :status, :betaald)";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);        
        $stmt = $dbh->prepare($sql);        
        $stmt->execute(array(
            ':broodjeId' => $broodje->getId(),
            ':userId' => $user->getId(),
            ':datum' => date("Y-m-d H:i:s"),
            ':prijs' => $broodje->getPrijs(),
            ':status' => 1,
            ':betaald' => 0
        ));
        
        $dbh = null;
    } 
}