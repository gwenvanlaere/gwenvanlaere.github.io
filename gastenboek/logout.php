<?php 
    declare(strict_types=1);    
    session_start();
    unset($_SESSION["gebruiker"]);    
    session_destroy();
    require_once 'header.php';
?>
<h2 class="logout">Logout</h2>
<h3 class="logout">U bent uitgelogd!</h3>
<?php
    require_once 'footer.php';
?>