<?php
declare(strict_types=1);
require_once 'Bericht.php';
require_once 'DatabaseConnection.php';

class Gastenboek {
    private string $dbConn;
    private string $dbUsername;
    private string $dbPassword;

    public function __construct() {
        $connection = new DatabaseConnection();
        $this->dbConn = $connection->getDbConn();
        $this->dbUsername = $connection->getDbUsername();
        $this->dbPassword = $connection->getDbPassword();
    }

    public function getList() : array {        
        $sql = "select id, userId, boodschap, datum from berichten order by datum desc";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);
        $resultSet = $dbh->query($sql);

        $lijst= array();
        foreach ($resultSet as $rij) {
            $bericht = new Bericht((int) $rij["id"], (string) $rij["userId"], 
            (string) $rij["boodschap"], (string) $rij["datum"]);
            array_push($lijst, $bericht);
        }
        $dbh = null;
        return $lijst;
    }

    public function createBericht(string $userId, string $boodschap) {
        
        $sql = "insert into berichten (userId, boodschap, datum) values (:userId, :boodschap, :datum)";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);
        
        $stmt = $dbh->prepare($sql);
        $datum = date("Y-m-d H:i:s");        
        $stmt->execute(array(
            ':userId' => $userId,
            ':boodschap' => $boodschap,
            ':datum' => $datum
        ));
        $dbh = null;
    }    
}