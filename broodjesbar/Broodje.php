<?php
declare(strict_types=1);

class Broodje {
    private $id;
    private string $naam;
    private string $omschrijving;
    private float $prijs;
    private string $image;    

    public function __construct($id = null, string $naam, string $omschrijving, float $prijs, string $image) {
        $this->id = $id;
        $this->naam = $naam;
        $this->omschrijving = $omschrijving;
        $this->prijs = $prijs;
        $this->image = $image;
    } 
    public function getId() : int {
        return $this->id;
    }   
    public function getNaam() : string {
        return $this->naam;
    }   
    public function getOmschrijving() : string {
        return $this->omschrijving;
    }   
    public function getPrijs() : float {
        return $this->prijs;
    } 
    public function getImage() : string {
        return $this->image;
    } 
}