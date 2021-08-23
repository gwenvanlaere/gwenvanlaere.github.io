<?php
declare(strict_types=1);

class DatabaseConnection {
    private string $dbConn;
    private string $dbUsername;
    private string $dbPassword;
    
    public function __construct() {
        $this->dbConn = "mysql:host=ID354892_gastenboek.db.webhosting.be;dbname=ID354892_gastenboek;charset=utf8";
        $this->dbUsername = "ID354892_gastenboek";
        $this->dbPassword = "kvkmrvei1";
    }
    public function getDbConn() {
        return $this->dbConn;
    }
    public function getDbUsername() {
        return $this->dbUsername;
    }
    public function getDbPassword() {
        return $this->dbPassword;
    }
}