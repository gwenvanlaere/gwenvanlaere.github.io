<?php 
    declare(strict_types=1);    
    session_start();
    unset($_SESSION["gebruiker"]);
    unset($_SESSION["superuser"]);
    session_destroy();
    require_once("header.php");
?>
<h1>Logout</h1>
<h2>U bent uitgelogd</h2>