<?php
declare(strict_types=1);

class Connection {
    private string $dbConn;
    private string $dbUsername;
    private string $dbPassword;
    
    public function __construct() {
        $this->dbConn = "mysql:host=ID354892_broodjesbar.db.webhosting.be;dbname=ID354892_broodjesbar;charset=utf8";
        $this->dbUsername = "ID354892_broodjesbar";
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