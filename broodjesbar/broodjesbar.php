<?php
require_once("header.php");
require_once("BroodjesLijst.php");
$bl = new BroodjesLijst();
$lijst = $bl->getList();
?>
<h1 class="mainTitle">Broodjes Bar</h1>
<h2 class="subTitle">Voor kleine en grote hongertjes</h2>
<ul class="broodjesCarouselIndex">
    <?php for ( $i = 0; $i < 5; $i++ ) {  
    shuffle($lijst);
    $selected = array_pop($lijst);
    print("<li><h3>" . $selected->getNaam() . "</h3>
    <img src='./img/" . $selected->getImage() . "' alt='" . $selected->getNaam() . "'></li>" );
}?>
</ul>
<section class="bVDeWeek">
    <h2>Broodje van de week!</h2>
    <h3>Tonijntino</h3>
    <img src="./img/broodje-tonijntino.jpg" alt="broodje tonijntino">
</section>
<section class="nieuw">
    <h2>Nieuw in ons gamma!</h2>
    <h3>Sombrero</h3>
    <img src="./img/broodje-sombrero.jpg" alt="broodje sombrero">
</section>
<a class="cta cta-aanbod" href="aanbod.php">Bekijk ons volledige aanbod</a>
<?php
require_once("footer.php");
?>