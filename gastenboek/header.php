<?php 
session_start();
require_once 'User.php';
?>
<!DOCTYPE html>
<html lang="nl">

<head>
    <script src='./script/gastenboek.js' defer></script>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gastenboek</title>
    <link rel="stylesheet" href="./styles/gastenboek.css">
</head>

<body>
    <nav>
        <?php if (isset($_SESSION["gebruiker"])) { ?>
        <ul>
            <li><a href="index.php">Home</a></li>
            <li><a href="logout.php">Uitloggen</a></li>
            <li>Bezoeker: <br>
                <?php if(isset($_SESSION["gebruiker"])) {
                    $gebruiker = unserialize($_SESSION["gebruiker"], ["User"]);
                    echo $gebruiker->getVollNaam();
                    }?>
            </li>
        </ul>
    </nav>
    <?php }else {?>
    <ul>
        <li><a href="index.php">Home</a></li>
        <li><a href="loginRegister.php">Inloggen</a></li>
    </ul>
    </nav>
    <?php } ?>
    <h1 class="main-title">Gastenboek</h1>
    <main>

</html>