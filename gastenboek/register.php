<?php
    declare(strict_types=1);
    session_start(); 
    require_once("User.php");
    
    $error = "";    
    if (isset($_POST["btnRegistreer"])) {
        $voornaam = "";
        $familienaam = "";
        $email = "";
        $wachtwoord = "";
        $wachtwoordHerhaal = "";
        if (!empty($_POST["txtVoornaam"]) && !empty($_POST["txtFamilienaam"])) {
            $voornaam = $_POST["txtVoornaam"];
            $familienaam = $_POST["txtFamilienaam"];
            $_SESSION['voornaam'] = $voornaam;
            $_SESSION['familienaam'] = $familienaam;
        } else {
            $error .= "Uw voornaam en familienaam moeten ingevuld worden.<br>";
        }        
        if (!empty($_POST["txtEmail"])) {
            $email = $_POST["txtEmail"];
            $_SESSION['email'] = $email;
        } else {
            $error .= "Het e-mailadres moet ingevuld worden.<br>";
        }
        if (!empty($_POST["txtWachtwoord"]) && !empty($_POST["txtWachtwoordHerhaal"])) {
            $wachtwoord = $_POST["txtWachtwoord"];
            $wachtwoordHerhaal = $_POST["txtWachtwoordHerhaal"];
        } else {
            $error .= "Beide wachtwoordvelden moeten ingevuld worden.<br>";
        }
        if ($error == "") {
            try {
                $gebruiker = new User();
                $gebruiker->setVoornaam($voornaam);
                $gebruiker->setFamilienaam($familienaam);
                $gebruiker->setEmail($email);
                $gebruiker->setWachtwoord($wachtwoord, $wachtwoordHerhaal);                
                $gebruiker = $gebruiker->register();
                $_SESSION["gebruiker"] = serialize($gebruiker);
            } catch (OngeldigEmailadresException $e) {
                $error .= "Het ingevulde e-mailadres is geen geldig e-mailadres.<br>";                
            } catch (WachtwoordenKomenNietOvereenException $e) {
                $error .= "De ingevulde wachtwoorden komen niet overeen.<br>";
            } catch (WachtwoordIsTeKortException $e) {
                $error .= "Uw wachtwoord moet minstens 8 karakters bevatten.<br>";
            } catch (GebruikerBestaatAlException $e) {
                $error .= "Er bestaat al een gebruiker met dit e-mailadres.<br>";
            }
        }
    }
?>

<h2 class="page-title">Registreren</h2>
<?php
    if ($error == "" && isset($_SESSION["gebruiker"])) {
        unset($_SESSION["voornaam"]);
        unset($_SESSION["familienaam"]);
        unset($_SESSION["email"]);
        setcookie("email", $email, time() + 3600 * 24 * 30);        
        echo "U bent succesvol geregistreerd. <br/>
        Ga verder naar <a href='index.php'>gastenboek</a>";
    } else if ($error != "") {
        echo "<span class='formError'>" . $error . "</span>";
    }
    if (!isset($_SESSION["gebruiker"])) {
?>
<form action="<?php echo htmlentities($_SERVER["PHP_SELF"]); ?>" method="post">
    Voornaam : <input type="text" name="txtVoornaam"
        <?php (isset($_SESSION['voornaam']) ? print('value="' . $_SESSION['voornaam'] . '"') : '')?>><br><br>
    Familienaam : <input type="text" name="txtFamilienaam"
        <?php (isset($_SESSION['familienaam']) ? print('value="' . $_SESSION['familienaam'] . '"') : '')?>><br><br>
    E-mailadres: <input type="email" name="txtEmail"
        <?php (isset($_SESSION['email']) ? print('value="' . $_SESSION['email'] . '"') : '')?>><br><br>
    Wachtwoord: <input type="password" name="txtWachtwoord"><br><br>
    Herhaal wachtwoord: <input type="password" name="txtWachtwoordHerhaal"><br><br>
    <input type="submit" value="Registreer" name="btnRegistreer">
</form>
<?php
}
    require_once("footer.php");
?>