<?php
declare(strict_types=1);
require_once 'exceptions.php';
require_once 'DatabaseConnection.php';

class User {
    private $id;
    private $voornaam;
    private $familienaam;
    private $email;
    private $wachtwoord; 
    private $datum;   
    
    private string $dbConn;
    private string $dbUsername;
    private string $dbPassword;
    
    public function __construct($cid = null, $cvnaam = null, $cfnaam = null, $cemail = null, $cwachtwoord = null) {
        $this->id = $cid;
        $this->voornaam = $cvnaam;
        $this->familienaam = $cfnaam;
        $this->email = $cemail;
        $this->wachtwoord = $cwachtwoord;         

        $connection = new DatabaseConnection();
        $this->dbConn = $connection->getDbConn();
        $this->dbUsername = $connection->getDbUsername();
        $this->dbPassword = $connection->getDbPassword();
    }

    public function getId() {
        return $this->id;
    }
    public function getVoornaam() {
        return $this->voornaam;
    }
    public function getVollNaam() {
        return $this->voornaam . ' ' . $this->familienaam;
    }
    public function getEmail() {
        return $this->email;
    }
    public function getWachtwoord() {
        return $this->wachtwoord;
    }    
    public function getRegistratieDatum() {
        return $this->datum;
    }    

    public function setVoornaam($voornaam) {
        $this->voornaam = $voornaam;
    }
    public function setFamilienaam($familienaam) {
        $this->familienaam = $familienaam;
    }
    public function setEmail($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new OngeldigEmailadresException();
        }
        $this->email = $email;
    }
    public function setWachtwoord($wachtwoord, $herhaalwachtwoord) {
        if (strlen($wachtwoord) < 8) {
            throw new WachtwoordIsTeKortException();
        }
        if ($wachtwoord !== $herhaalwachtwoord) {
            throw new WachtwoordenKomenNietOvereenException();
        }        
        $this->wachtwoord = password_hash($wachtwoord, PASSWORD_DEFAULT);           
    }    
    public function emailReedsInGebruik() {
        $sql = "SELECT * FROM users WHERE emailadres = :emailadres";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);
        $stmt = $dbh->prepare($sql);        
        $stmt->execute(array(':emailadres' => $this->email));
        $rowCount = $stmt->rowCount();        
        $dbh = null;
        return $rowCount;
    }
    public function register() {
        $rowCount = $this->emailReedsInGebruik();
        if ($rowCount > 0) {
            throw new GebruikerBestaatAlException();
        }
        $sql = "INSERT INTO users (voornaam, familienaam, emailadres, wachtwoord, datum) 
        VALUES (:voornaam, :familienaam, :emailadres, :wachtwoord, :datum)";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);
        $stmt = $dbh->prepare($sql);
        $stmt->execute(array(
            ':voornaam' => $this->voornaam,
            ':familienaam' => $this->familienaam,
            ':emailadres' => $this->email,
            ':wachtwoord' => $this->wachtwoord,
            ':datum' => date("Y-m-d H:i:s")
        ));        
        $laatsteNieuweId = $dbh->lastInsertId();
        $dbh = null;
        $this->id = $laatsteNieuweId;
        return $this;
    }
    public function login() {
        $rowCount = $this->emailReedsInGebruik();
        if ($rowCount == 0) {
            throw new GebruikerBestaatNietException();
        }
        $sql = "SELECT id, voornaam, familienaam, wachtwoord, datum FROM users WHERE emailadres = :emailadres";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);
        $stmt = $dbh->prepare($sql);
        $stmt->execute(array(':emailadres' => $this->email));
        $resultSet = $stmt->fetch(PDO::FETCH_ASSOC);        
        $isWachtwoordCorrect = password_verify($this->wachtwoord, $resultSet["wachtwoord"]);        
        if (!$isWachtwoordCorrect) {
            throw new WachtwoordIncorrectException();
        }               
        $this->id = $resultSet["id"];
        $this->voornaam = $resultSet["voornaam"];
        $this->familienaam = $resultSet["familienaam"];
        $this->datum = $resultSet["datum"];
        
        $dbh = null;
        return $this;
    }
    public function getUserById($id) : User {
        $sql = "SELECT id, voornaam, familienaam, wachtwoord, emailadres, datum FROM users WHERE id = :id";
        $dbh = new PDO($this->dbConn, $this->dbUsername, $this->dbPassword);
        $stmt = $dbh->prepare($sql);
        $stmt->execute(array(':id' => $id));
        $resultSet = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $this->id = $resultSet["id"] ?? 'default';
        $this->voornaam = $resultSet["voornaam"] ?? 'default';
        $this->familienaam = $resultSet["familienaam"] ?? 'default';        
        $this->email = $resultSet["email"] ?? 'default';
        $this->datum = $resultSet["datum"] ?? 'default';

        $dbh = null;
        return $this;
    }    
}