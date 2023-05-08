<?php
$microtime = microtime(true);

include 'database.php';

if(isset($_GET['action']) and $_GET['action'] === 'saveHistory'){
    include "func/saveHistory.php";
    saveHistory();
}

if(isset($_GET['action']) and $_GET['action'] === 'loadHistory'){

    $guid = htmlspecialchars($_GET['gameId']);
    include "func/loadHistory.php";
    loadHistory($guid);
}