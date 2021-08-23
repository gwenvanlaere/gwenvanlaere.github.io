<?php
    declare(strict_types=1);
    require_once("header.php");    
    require_once 'User.php';
    
    $error = "";
    if (isset($_POST["btnLogin"])) {
        $email = "";
        $wachtwoord = "";
        if (!empty($_POST["txtEmail"])) {
            $email = $_POST["txtEmail"];
        } else {
            $error .= "Het e-mailadres moet ingevuld worden.<br>";
        }
        if (!empty($_POST["txtWachtwoord"])) {
            $wachtwoord = $_POST["txtWachtwoord"];
        } else {
            $error .= "Het wachtwoord moet ingevuld worden.<br>";
        }
        if ($error == "") {            
            try {
                $gebruiker = new User(null, null, null, $email, $wachtwoord);
                $gebruiker = $gebruiker->login();
                $_SESSION["gebruiker"] = serialize($gebruiker);                
            } catch (WachtwoordIncorrectException $e) {
                $error .= "Het wachtwoord is niet correct.<br>";
            } catch (GebruikerBestaatNietException $e) {
                $error .= "Er bestaat geen gebruiker met dit e-mailadres.<br>
                <a href='register.php'>Registreer je </a>om een account aan te maken";
            }
        }
    }   
?>
<h2 class="page-title">Login</h2>
<?php
    if ($error == "" && isset($_SESSION["gebruiker"])) { 
        setcookie("email", $email, time() + 3600 * 24 * 30);       
        header("Location: index.php");
        exit;
    }
    else if ($error != "") {
        echo "<span class='formError'>" . $error . "</span>";
    }
    if (!isset($_SESSION["gebruiker"])) {
    ?>
<form action="<?php echo htmlentities($_SERVER["PHP_SELF"]); ?>" method="post">
    E-mailadres: <input type="email" name="txtEmail"
        <?php (isset($_COOKIE['email']) ? print('value="' . $_COOKIE['email'] . '"') : '')?>><br>
    Wachtwoord: <input type="password" name="txtWachtwoord"><br>
    <input type="submit" value="Inloggen" name="btnLogin">
</form>
<?php
    }    
    require_once("footer.php");
?>