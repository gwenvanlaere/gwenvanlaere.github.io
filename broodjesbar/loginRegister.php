<?php
    declare(strict_types=1);
    require_once("header.php");    
    require_once 'User.php';
    
    $error = "";
    $formState ="";
    
    /** inloggen **/
    if (isset($_POST["btnLogin"])) {
        $formState = "login";
        $email = "";
        $wachtwoord = "";
        if (!empty($_POST["txtEmail"])) {
            $email = htmlspecialchars($_POST["txtEmail"]);
        } else {
            $error .= "Het e-mailadres moet ingevuld worden.<br>";
        }
        if (!empty($_POST["txtWachtwoord"])) {
            $wachtwoord = htmlspecialchars($_POST["txtWachtwoord"]);
        } else {
            $error .= "Het wachtwoord moet ingevuld worden.<br>";
        }
        if ($error == "") {            
            try {
                $gebruiker = new User(null, null, null, $email, $wachtwoord);
                $gebruiker = $gebruiker->login();
                if($gebruiker->getRole() == 1) {
                    $_SESSION["superuser"] = serialize($gebruiker);
                }else {
                    $_SESSION["gebruiker"] = serialize($gebruiker);
                }
            } catch (WachtwoordIncorrectException $e) {
                $error .= "Het wachtwoord is niet correct.<br>";
            } catch (GebruikerBestaatNietException $e) {
                $error .= "Er bestaat geen gebruiker met dit e-mailadres.<br>
                Maak een nieuw account aan";
            }catch (GeblokkeerdeGebruiker $e) {
                $error .= "Uw account werd geblokkeerd.<br>";
            }
        }
    }

    /** registreren **/
    if (isset($_POST["btnRegistreer"])) {
        $formState = "registreer";
        $voornaam = "";
        $familienaam = "";
        $email = "";
        $wachtwoord = "";
        $wachtwoordHerhaal = "";
        if (!empty($_POST["txtVoornaam"]) && !empty($_POST["txtFamilienaam"])) {
            $voornaam = htmlspecialchars($_POST["txtVoornaam"]);
            $familienaam = htmlspecialchars($_POST["txtFamilienaam"]);
            $_SESSION['voornaam'] = $voornaam;
            $_SESSION['familienaam'] = $familienaam;
        } else {
            $error .= "Uw voornaam en familienaam moeten ingevuld worden.<br>";
        }        
        if (!empty($_POST["txtEmail"])) {
            $email = htmlspecialchars($_POST["txtEmail"]);
            $_SESSION['email'] = $email;
        } else {
            $error .= "Het e-mailadres moet ingevuld worden.<br>";
        }
        if (!empty($_POST["txtWachtwoord"]) && !empty($_POST["txtWachtwoordHerhaal"])) {
            $wachtwoord = htmlspecialchars($_POST["txtWachtwoord"]);
            $wachtwoordHerhaal = htmlspecialchars($_POST["txtWachtwoordHerhaal"]);
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
                $gebruiker->setRole(0);
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
    if ($error == "" && isset($_SESSION["gebruiker"])) {
        unset($_SESSION["voornaam"]);
        unset($_SESSION["familienaam"]);
        unset($_SESSION["email"]); 
        setcookie("email", $email, time() + 3600 * 24 * 30);
        echo "<script type='text/javascript'> document.location = 'bestellen.php'; </script>";
        exit;
    }
    if ($error == "" && isset($_SESSION["superuser"])) {
        echo "<script type='text/javascript'> document.location = 'overzicht.php'; </script>";
        exit;
    }?>
<p class="small"><b>Superuser login: </b><em>superuser@broodjesbar.be</em><br><b>Superuser pw: </b><em>superuser</em>
</p>
<div class="container">
    <div class="containerBg">
        <div class="box signin">
            <h2>Ik heb al een account</h2>
            <button class="signinBtn">Login</button>
        </div>
        <div class="box signup">
            <h2>Ik heb nog geen account</h2>
            <button class="signupBtn">Registreer</button>
        </div>
    </div>
    <div class="formBx">
        <section class="form signinForm">
            <?php
            if (!isset($_SESSION["gebruiker"]) && !isset($_SESSION["superuser"])) {
                if ($error != "" && $formState === "login") {
                    echo "<span class='formError " . $formState . "'>" . $error . "</span>";
                }
            ?>
            <form action="<?php echo htmlentities($_SERVER["PHP_SELF"]); ?>" method="post">
                <h3>Login</h3>
                <input type="email" name="txtEmail" id="txtEmailLog"
                    <?php (isset($_COOKIE['email']) ? print('value="' . $_COOKIE['email'] . '"') : '')?> required>
                <label for="txtEmail">E-mailadres</label>
                <input type="password" name="txtWachtwoord" id="txtWachtwoordLog" required>
                <label for="txtWachtwoordLog">Paswoord</label>
                <input class="gta gta-login" type="submit" value="Inloggen" name="btnLogin">
            </form>
        </section>
        <section class="form signupForm">
            <?php if ($error != "" && $formState === "registreer") {
                    echo "<span class='formError " . $formState . "'>" . $error . "</span>";
                }?>
            <form action="<?php echo htmlentities($_SERVER["PHP_SELF"]); ?>" method="post">
                <h3>Registreren</h3>
                <input type="text" name="txtVoornaam" id="txtVoornaam"
                    <?php (isset($_SESSION['voornaam']) ? print('value="' . $_SESSION['voornaam'] . '"') : '')?>
                    required>
                <label for="txtVoornaam">Voornaam</label>
                <input type="text" name="txtFamilienaam" id="txtFamilienaam"
                    <?php (isset($_SESSION['familienaam']) ? print('value="' . $_SESSION['familienaam'] . '"') : '')?>
                    required>
                <label for="txtFamilienaam">Familienaam</label>
                <input type="email" name="txtEmail" id="txtEmailReg"
                    <?php (isset($_SESSION['email']) ? print('value="' . $_SESSION['email'] . '"') : '')?> required>
                <label for="txtEmailReg">Email</label>
                <input type="password" name="txtWachtwoord" id="txtWachtwoordReg" minlength="8" required>
                <label for="txtWachtwoordReg">Paswoord</label>
                <input type="password" name="txtWachtwoordHerhaal" id="txtWachtwoordHerhaal" minlength="8" required>
                <label for="txtWachtwoordHerhaal">Bevestig Paswoord</label>
                <input class="gta gta-registreer" type="submit" value="Registreer" name="btnRegistreer"
                    id="btnRegistreer">
            </form>
        </section>
    </div>
</div>
<?php
    }    
    require_once("footer.php");
?>