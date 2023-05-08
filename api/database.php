<?php
if($_SERVER['REMOTE_ADDR'] === '127.0.0.1'){
    $mysql = new mysqli("127.0.0.1"
        , "root", "", "chess");
}
else{
    $mysql = new mysqli("127.0.0.1"
        , "cu71509_chess01", "ywg13XLn", "cu71509_chess01");
}

if ($mysql->connect_error) {
    print "Нет подключения к базе данных: ".($mysql->connect_error);
    exit();
};