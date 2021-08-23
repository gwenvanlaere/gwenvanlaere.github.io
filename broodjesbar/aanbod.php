<?php 
require_once("header.php");
require_once("BroodjesLijst.php");

if (isset($_GET["action"]) && $_GET["action"] === "bestel") {
    if(isset($_SESSION["gebruiker"]) || isset($_SESSION["superuser"])) {
        echo "<script type='text/javascript'> document.location = 'bestellen.php'; </script>";
        exit();
    }else {
        echo "<script type='text/javascript'> document.location = 'loginRegister.php'; </script>";
        exit();
    }
}

$bl = new BroodjesLijst();
$lijst = $bl->getList();
?>
<h1>Ons aanbod</h1>
<ul class="broodjesCarouselAanbod">
    <?php foreach ( $lijst as $broodje) {
    print("<li><h3>" . $broodje->getNaam() . "</h3>
    <p>" . $broodje->getOmschrijving() . "</p>    
    <img src='./img/" . $broodje->getImage() . "' alt='" . $broodje->getNaam() . "'>
    <p>€ " . $broodje->getPrijs() . "</p>
    <a class='cta cta-bestel' href='aanbod.php?action=bestel'>Bestellen</a></li>" );
}?>
    <?php 
require_once("footer.php");
?>