<?php
include 'api/database.php';

$query = $mysql->prepare("CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `guid` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `single` tinyint(1) DEFAULT NULL,
  `timestart` int(11) DEFAULT NULL,
  `timelastmove` int(11) DEFAULT NULL,
  `movenumber` int(11) DEFAULT NULL,
  `startPositions` text COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
$query->execute();

$query = $mysql->prepare("ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `guid` (`guid`);");
$query->execute();

$query = $mysql->prepare("ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;");
$query->execute();

$query = $mysql->prepare("CREATE TABLE `moves` (
  `id` int(11) NOT NULL,
  `guid` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `player` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moveFrom` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moveTo` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comments` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
$query->execute();

$query = $mysql->prepare("ALTER TABLE `moves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guid` (`guid`);");
$query->execute();

$query = $mysql->prepare("ALTER TABLE `moves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;");
$query->execute();
