<?php 
    declare(strict_types=1);   
    require_once("header.php");
    require_once("User.php");
    require_once("BroodjesLijst.php");
    require_once("BestellingsLijst.php");
    
    if (!isset($_SESSION["gebruiker"]) && !isset($_SESSION["superuser"])) {
        echo "<script type='text/javascript'> document.location = 'aanbod.php'; </script>";
        exit;
    }
    if(isset($_SESSION["gebruiker"])) {
        $gebruiker = unserialize($_SESSION["gebruiker"], ["User"]);
    }else{
        $gebruiker = unserialize($_SESSION["superuser"], ["User"]);
    }
    $pl = new BroodjesLijst();  
    if (isset($_GET["action"]) && $_GET["action"] === "bestel") {
        $broodje = $pl->getBroodjeById(intval($_GET["id"]));
        $best = new BestellingsLijst();
        $best->createBestelling($broodje, $gebruiker);
        $melding = 'Bedankt voor uw bestelling!<br/> Uw broodje <span>' . $broodje->getNaam() . '</span> wordt klaargemaakt.';        
    }
    if (isset($_GET["action"]) && $_GET["action"] === "newbroodje") {
        $naam = htmlspecialchars($_POST["naam"]);
        $omschrijving = htmlspecialchars($_POST["omschrijving"]);
        $broodje = new Broodje(null, (string) $naam, (string) $omschrijving, (float) $_POST["prijs"], (string) "default.jpg");
        $pl->createBroodje($broodje);
    }
    if (isset($_GET["action"]) && $_GET["action"] === "deletebroodje") {
        $pl->deleteBroodje(intval($_GET["id"]));        
    }
    $blijst = $pl->getList(); 
    ?>

<h1>Bestellen</h1>
<h2>Welkom, <span class="klantNaam"><?php echo $gebruiker->getVollNaam(); ?></span> !</h2>
<?php !empty($melding) ? print('<p class="melding">' . $melding . '</p>') : print('');?>
<table class="broodjesTabel">
    <tbody>
        <tr>
            <th>Naam</th>
            <th>Ingrediënten</th>
            <th>Prijs</th>
            <th></th>
        </tr>
        <?php foreach($blijst as $broodje) {
        print("<tr><td>" . $broodje->getNaam() . "</td>
        <td>" . $broodje->getOmschrijving() . "</td>
        <td>" . $broodje->getPrijs() . " euro</td>");
        if(isset($_SESSION["superuser"])) {
            print("<td><a class='cta' href='bestellen.php?action=deletebroodje&id=" . $broodje->getId() . "'>Verwijder</a></td></tr>");
        }else{
            print("<td><a class='cta' href='bestellen.php?action=bestel&id=" . $broodje->getId() . "'>Bestel</a></td></tr>");
        }
    }
    ?>
    </tbody>
</table>
<?php if(isset($_SESSION["superuser"])) {?>
<h2>Broodje aanmaken</h2>
<form class="broodjeAanmaken" action="bestellen.php?action=newbroodje" method="post">
    Naam: <input type="text" name="naam" required><br>
    Omschrijving: <input type="text" name="omschrijving" required><br>
    Prijs: <input type="number" name="prijs" step=".01" required><br>
    <input class='cta' type="submit" value="Aanmaken">
</form>

<?php }
    ?>
<?php 
    require_once("footer.php");
?>