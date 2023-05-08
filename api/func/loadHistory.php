<?php
function loadHistory($guid){
    global $mysql, $microtime;

    $queryGameInfo = $mysql->prepare("SELECT * FROM `games` WHERE `guid` = ? LIMIT 1");
    $queryGameInfo->bind_param('s', $guid);
    $queryGameInfo->execute();

    $answer = [];

    $resultGameInfo = $queryGameInfo->get_result();
    if($resultGameInfo->num_rows === 0){
        print json_encode([
            'status' => 'error',
            'message' => 'game not found'
        ]);
        exit();
    }
    $rowGameInfo = $resultGameInfo->fetch_assoc();
    $answer['startPosition'] = $rowGameInfo['startPositions'];
    $answer['single'] = $rowGameInfo['single'];


    $query = $mysql->prepare("SELECT * FROM `moves` WHERE `guid` = ? ORDER BY `number` ASC");
    $query->bind_param('s', $guid);
    $query->execute();

    $result = $query->get_result();

    $answer['status'] = 'success';
    $answer['message'] = 'loaded';
    $answer['history'] = [];
    while($row = $result->fetch_assoc()){
        $answer['history'][] = [''. $row['moveFrom'] . $row['moveTo'],
            $row['description']];
    }

    print json_encode($answer);
}