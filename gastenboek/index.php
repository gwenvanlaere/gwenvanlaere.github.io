<?php
declare(strict_types=1);
require_once 'header.php';
require_once 'Gastenboek.php';

$gboek = new Gastenboek();
if (isset($_SESSION["gebruiker"]) && isset($_GET["action"]) && $_GET["action"] === "new") {    
        $gebruiker = unserialize($_SESSION["gebruiker"], ["User"]);   
        $boodschap = htmlspecialchars($_POST["boodschap"]);        
        if(!empty($gebruiker) && !empty($boodschap)) {
            $gboek->createBericht((string) $gebruiker->getId(), (string) $boodschap);
        }
}
$list = $gboek->getList();
?>
<section class="berichten">
    <h2>Berichten3</h2>
    <div class="berichtenBox">
        <?php foreach($list as $bericht) {
            $userId = $bericht->getUserId();
            $nUser = new User();                      
            $userName = $nUser->getUserById($userId)->getVollNaam();

            $splitDate = explode(' ', $bericht->getDatum(), 2);
            $datum = date("d-m-Y", strtotime($splitDate[0])) . ' ' . $splitDate[1];                         
            
            print('<ul class="message"><li class="msgNaam">' . $userName . '</li><br>
            <li class="msgBoodschap">' . $bericht->getBoodschap() . '</li><br>
            <li class="msgDate"><time>' . $datum . '</time></li></ul>');
    }?>
    </div>
</section>
<section class="toevoegenBericht">
    <?php 
    if (!isset($_SESSION["gebruiker"]) && isset($_GET["action"]) && $_GET["action"] === "new") {
        print('<br><p class="formError bericht"><a href="loginRegister.php" class="underline">Log in </a>om een bericht te plaatsen.</p>');
    }?>
    <h2>Bericht toevoegen</h2>
    <form action="index.php?action=new" method="post">
        <textarea rows="4" cols="50" name="boodschap" maxlength="255"></textarea><br><br>
        <input type="submit" value="Verzenden">
    </form>
</section>
<?php require_once 'footer.php'?>
</body>

</html>