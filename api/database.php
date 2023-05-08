<?php
$mysql = new mysqli("127.0.0.1"
    , "root", "", "chess");

if ($mysql->connect_error) {
    print "Нет подключения к базе данных: ".($mysql->connect_error);
    exit();
};