<?php
function saveHistory(){
    global $mysql, $microtime;
    try{
        $request = json_decode(file_get_contents('php://input'), true);

        $guid = htmlspecialchars($request['gameId']);
        $single = intval($request['single']);
        $timeStart = time();
        $timeLastMove = time();
        $movenumber = intval($request['moveNumber']);

        $startPositions = htmlspecialchars($request['startPosition']);
        $history = json_decode($request['history']);

        $query = $mysql->prepare("SELECT * FROM `games` WHERE `guid` = ? LIMIT 1");
        $query->bind_param('s', $guid);
        $query->execute();
        $result = $query->get_result();
        if($result->num_rows === 0){
            $insertQuery = $mysql->prepare("INSERT INTO `games` (`guid`, `single`, `timeStart`, `timeLastMove`, `movenumber`, `startPositions`) VALUES (?, ?, ?, ?, ?, ?)");
            $insertQuery->bind_param('ssssss', $guid, $single, $timeStart, $timeLastMove, $movenumber, $startPositions);
            $insertQuery->execute();
            if($insertQuery->affected_rows === 0){
                throw new Exception('error insert'.$mysql->error);
            }
            $answer = array(
                'status' => 'success',
                'message' => 'started',
                'gameId' => $guid,
                'microtime' => microtime(true)- $microtime
            );
            $countMove = 0;
        }
        else{
            $updateQuery = $mysql->prepare("UPDATE `games` SET `single` = ?, `timeLastMove` = ?, `movenumber` = ?, `startPositions` = ? WHERE `guid` = ?");
            $updateQuery->bind_param('isiss', $single, $timeLastMove, $movenumber, $startPositions, $guid);
            $updateQuery->execute();
            if($updateQuery->affected_rows === 0){
                throw new Exception('error update'.$mysql->error);
            }
            $answer = array(
                'status' => 'success',
                'message' => 'updated',
                'gameId' => $guid,
                'microtime' => microtime(true) - $microtime,
            );
            $countMove = $result->fetch_assoc()['movenumber'];
        }

        $queryMoves = $mysql->prepare("SELECT MAX(`number`) as maxnumber FROM `moves` WHERE `guid` = ? ORDER BY `number` ASC LIMIT 1");
        $queryMoves->bind_param('s', $guid);
        $queryMoves->execute();

        $resultMoves = $queryMoves->get_result();
        if($resultMoves->num_rows === 0){
            $countMove = 0;
        }
        else{
            $countMove = $resultMoves->fetch_assoc()['maxnumber'];
        }

        while($movenumber > $countMove){
            $insertQuery = $mysql->prepare("INSERT INTO `moves` (`guid`, `number`, `time`, `player`, `moveFrom`, `moveTo`, `description`, `comments`)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

            $moveFrom = "" . $history[$movenumber - 1]->from->x.$history[$movenumber - 1]->from->y;
            $moveTo = "" . $history[$movenumber - 1]->to->x .$history[$movenumber - 1]->to->y;
            $timeLastMove = time();
            $comments = "";

            $insertQuery->bind_param('sissssss', $guid, $movenumber, $timeLastMove, $history[$movenumber-1]->player,
                $moveFrom, $moveTo, $history[$movenumber-1]->representation, $comments);
            $insertQuery->execute();
            print $mysql->error;
            $movenumber--;
        }

        print json_encode($answer);

    }
    catch (Exception $exception){

        $answer = array(
            'status' => 'error',
            'message' => $exception->getMessage()
        );

        print json_encode($answer);
    }
}