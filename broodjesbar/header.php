<?php 
session_start();
require_once 'User.php';
?>
<!DOCTYPE html>
<html lang="nl">

<head>
    <script src='./js/carousel.js' defer></script>
    <script src='./js/broodjesbar-main.js' defer></script>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Broodjes Bar</title>
    <link rel="stylesheet" href="./styles/broodjesbar.css">
</head>

<body>
    <nav>
        <span class="logo">Broodjes Bar</span>
        <?php if (isset($_SESSION["gebruiker"])) { ?>
        <ul>
            <li><a href="broodjesbar.php">Home</a></li>
            <li><a href="aanbod.php">Aanbod</a></li>
            <li><a href="bestellen.php">Bestellen</a></li>
            <li class="userLogout">
                <a href="logout.php">Logout</a>
                <span><?php echo unserialize($_SESSION["gebruiker"], ["User"])->getVoornaam();?></span>
            </li>
        </ul>
    </nav>
    <?php } elseif(isset($_SESSION["superuser"])){ ?>
    <ul>
        <li><a href="broodjesbar.php">Home</a></li>
        <li><a href="bestellen.php">Bestellen</a></li>
        <li><a href="overzicht.php">Overzicht</a></li>
        <li class="userLogout">
            <a href="logout.php">Logout</a>
            <span>Super User</span>
        </li>
    </ul>
    </nav>
    <?php }else {?>
    <ul>
        <li><a href="broodjesbar.php">Home</a></li>
        <li><a href="aanbod.php">Aanbod</a></li>
        <li><a href="loginRegister.php">Login</a></li>
    </ul>
    </nav>
    <?php } ?>
    <main>

</html>