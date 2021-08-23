<?php
declare(strict_types=1);

class Bericht {
    private int $id;
    private string $userId;
    private string $boodschap;
    private string $datum;

    public function __construct(int $id, string $userId, string $boodschap, string $datum) {
        $this->id = $id;
        $this->userId = $userId;
        $this->boodschap = $boodschap;
        $this->datum = $datum;
    }
    public function getId() : int {
        return $this->id;
    }
    public function getUserId() : string {
        return $this->userId;
    }
    public function getBoodschap() : string {
        return $this->boodschap;
    }
    public function getDatum() : string {
        return $this->datum;
    }
}