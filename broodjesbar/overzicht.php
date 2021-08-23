<?php 
    declare(strict_types=1);
    require_once 'header.php';    
    require_once 'User.php';
    require_once 'BestellingsLijst.php';
    require_once 'BroodjesLijst.php';

    $bestLijst = new BestellingsLijst();
    $overzicht = $bestLijst->getList();
?>
<h1>Overzicht</h1>
<h2>Bestellingen</h2>
<table class="bestellingsTabel">
    <tbody>
        <tr>
            <th>Naam broodje</th>
            <th>Klantnaam</th>
            <th>Prijs</th>
            <th>Besteldatum</th>
            <th>Status bestelling</th>
            <th>Betaald</th>
        </tr>
        <?php foreach($overzicht as $bestelling) {
            $broodjeId =$bestelling->getBroodjeId();
            $userId = $bestelling->getUserId();
            $brLijst = new BroodjesLijst();
            $broodje = $brLijst->getBroodjeById($broodjeId);
            $newUser = new User();            
            $user = $newUser->getUserById($userId);                           
        print("<tr><td>" . $broodje->getNaam() . "</td>
        <td>" . $user->getVollNaam() . "</td>
        <td>" . $bestelling->getPrijs() . " euro</td>
        <td>" . $bestelling->getDatum() . "</td>
        <td>" . $bestelling->getStatusNaam() . "</td>
        <td>" . $bestelling->getBetaald() . "</td></tr>");
    }
    ?>
    </tbody>
</table>
<?php 
    require_once("footer.php");
?>