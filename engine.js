function drawBoard(){

    let chessboard = document.querySelector('#chessboard');
    chessboard.innerHTML = '';
    chessState.positions = [...Array(8)].map(() => Array(8).fill({

    }));

    for(let x = 0; x < sizeX; x++){
        for (let y = 0; y<sizeY; y++){
            chessState.positions[x][y] = {
                player: '',
                chessPiece: '',
                x: x + 1,
                y: y + 1
            };
        }
    }

    for(let y = 1; y <= sizeY; y++){

        let divLine = document.createElement("div");
        divLine.classList.add("rowLine");

        let leftSquare = document.createElement("div");
        leftSquare.classList.add('left-line');
        leftSquare.textContent = `${sizeY - y + 1}`;

        divLine.append(leftSquare);

        for(let x = 1; x <= sizeX; x++){

            //ячейка
            let divSquare = document.createElement('div');
            divSquare.classList.add('square');

            //белые/черные квадраты
            if((x + y) % 2 === 0)
                divSquare.classList.add('white');
            else
                divSquare.classList.add('black');

            //Рамки вокруг
            if(y === 1)
                divSquare.classList.add('bd-top');

            if(y === sizeY)
                divSquare.classList.add('bd-bottom');

            if(x===sizeX)
                divSquare.classList.add('bd-right');

            if(x===1)
                divSquare.classList.add('bd-left');

            divSquare.setAttribute("data-x", '' + x);
            divSquare.setAttribute("data-y", '' + (sizeY - y + 1));

            divSquare.addEventListener('click', function (){
                showSteps.call(this);
            });

            divLine.append(divSquare);
        }
        chessboard.append(divLine);
    }

    let divLine = document.createElement("div");
    divLine.classList.add("down-row");

    let leftSquare = document.createElement("div");
    leftSquare.classList.add('left-line');
    divLine.append(leftSquare);

    let abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    for(let x = 0; x < sizeX; x++){

        let downCell = document.createElement('div');
        downCell.classList.add('down-cell');
        downCell.textContent = abc[x];
        divLine.append(downCell);
    }

    chessboard.append(divLine);
}

function iniStandard(){

    setPiece("black", 'rook', 1, 8);
    setPiece("black", 'horse-left', 2, 8);
    setPiece("black", "bishop", 3, 8);
    setPiece("black", "queen", 4, 8);
    setPiece("black", "king", 5, 8);
    setPiece("black", "bishop", 6, 8);
    setPiece("black", "horse-right", 7, 8);
    setPiece("black", "rook", 8, 8);

    for (let i = 1; i<=8; i++){
        setPiece("black", "pawn", i, 7);
        setPiece("white", "pawn", i, 2);
    }

    setPiece("white", "rook", 1, 1);
    setPiece("white", "horse-left", 2, 1);
    setPiece("white", "bishop", 3, 1);
    setPiece("white", "queen", 4, 1);
    setPiece("white", "king", 5, 1);
    setPiece("white", "bishop", 6, 1);
    setPiece("white", "horse-right", 7, 1);
    setPiece("white", "rook", 8, 1);

    chessState.castlingDone = {
        white: {
            done: false,
                leftRookMoved: false,
                rightRookMoved: false,
                kingMoved: false
        },
        black: {
            done: false,
                leftRookMoved: false,
                rightRookMoved: false,
                kingMoved: false
        },
    }

    setTurnToMove('white');
}

function setPiece(player, piece, x, y){

    let square = getCell(x,y);

    chessState.positions[x-1][y-1].player = player;
    chessState.positions[x-1][y-1].chessPiece = piece;
    if(piece !=='')
        square.innerHTML = "<img src='images/pieces/" + player + '/' + piece + ".png' alt='"+ piece + "' class='img-pieces'>";
    else
        square.innerHTML = '';
}

function changeTurnToMove(){
    if(chessState.turnToMove === '')
        setTurnToMove('white');
    else if(chessState.turnToMove === 'white')
        setTurnToMove('black');
    else
        setTurnToMove('white');
}

function setTurnToMove(turn){
    chessState.turnToMove = turn;
}

function showNewGameOptions(){

    let chessboard = document.querySelector('#chessboard');
    chessboard.innerHTML = '';

    let divButton = document.createElement('div');
    divButton.classList.add('text-center', 'shadow-lg', 'dropdown-header', 'my-2', 'mx-auto');

    let spanH1 = document.createElement('span');
    spanH1.innerHTML = '<h1>Please, select game options:</h1>';

    let spanLabelThisPC = document.createElement('span');
    spanLabelThisPC.innerHTML = ' or ';
    spanLabelThisPC.classList.add('my-md-3', 'card-body');

    let newButtonThisPC = document.createElement('button');
    newButtonThisPC.textContent = "THIS DEVICE";
    newButtonThisPC.classList.add('col-4', 'rounded');
    newButtonThisPC.addEventListener('click', ()=>{
        drawBoard();
        iniStandard();
    });

    let newButtonRemote = document.createElement('button');
    newButtonRemote.textContent = "REMOTE GAME";
    newButtonRemote.classList.add('col-4', 'rounded');
    newButtonRemote.addEventListener('click', ()=>{
        drawBoard();
        iniStandard();
    });

    divButton.append(spanH1);
    divButton.append(newButtonThisPC);
    divButton.append(spanLabelThisPC);
    divButton.append(newButtonRemote);

    chessboard.append(divButton);
}

function showSteps(){

    let squared = document.getElementsByClassName('selected');

    for (let i = squared.length - 1; i >= 0 ; i--){
        squared[i].style.removeProperty('background-color');
        squared[i].classList.remove('selected');
    }

    let checkCell = document.querySelector('.check');
    checkCell.classList.remove('check');

    let x = +this.dataset.x;
    let y = +this.dataset.y;

    let cellInfo = chessState.positions[x-1][y-1];

    if(chessState.selected.x > 0 && chessState.selected.y > 0){

        let selectedInfo = chessState.positions[chessState.selected.x-1][chessState.selected.y-1];
        let possibleMoves = getPossibleMoves(selectedInfo);

        for (let i = 0; i<possibleMoves.length; i++){
            if(x === possibleMoves[i].x && y === possibleMoves[i].y){
                setPiece(selectedInfo.player, selectedInfo.chessPiece, x, y);
                setPiece('', '', selectedInfo.x, selectedInfo.y);

                if(cellInfo.chessPiece === 'king'){
                    chessState.castlingDone[cellInfo.player].kingMoved = true;
                }

                if(cellInfo.chessPiece === 'rook' && selectedInfo.x === 1){
                    chessState.castlingDone[cellInfo.player].leftRookMoved = true;
                }

                if(cellInfo.chessPiece === 'rook' && selectedInfo.x === 8){
                    chessState.castlingDone[cellInfo.player].rightRookMoved = true;
                }
                if(cellInfo.chessPiece === 'king' && x === 3){
                    setPiece(cellInfo.player, 'rook', 4, y);
                    setPiece('', '', 1, selectedInfo.y);
                }

                if(cellInfo.chessPiece === 'king' && x === 7){
                    setPiece(cellInfo.player, 'rook', 6, y);
                    setPiece('', '', 8, selectedInfo.y);
                }
                chessState.selected = {
                    x: -1,
                    y: -1,
                    chessPiece: '',
                }

                changeTurnToMove();
                return;
            }
        }
    }

    if(cellInfo.player === chessState.turnToMove){

        chessState.selected = {
            x: x,
            y: y,
            chessPiece: cellInfo.chessPiece
        }

        showSelect(this);
        let possibleMoves = getPossibleMoves(cellInfo);
        for (let i = 0; i<possibleMoves.length; i++){
            showSelect(getCell(possibleMoves[i].x, possibleMoves[i].y), possibleMoves[i].capture)
        }

    }
}

function getPossibleMoves(cell, boardState){

    switch (cell.chessPiece){
        case 'pawn':
            return getPossibleMovesPawn(cell, boardState);
        case 'queen':
            return getPossibleMovesQueen(cell, boardState);
        case 'horse-left':
        case 'horse-right':
            return getPossibleMovesHorse(cell, boardState);
        case 'king':
            return getPossibleMovesKing(cell, boardState);
        case 'rook':
            return getPossibleMovesRook(cell, boardState);
        case 'bishop':
            return getPossibleMovesBishop(cell, boardState);
    }
}

function getPossibleMovesQueen(cell, boardState){

    if(boardState === undefined)
        boardState = chessState;

    let x = cell.x;
    let y = cell.y;
    let player = cell.player;
    let steps = [];

    for (let i = 1; i < sizeX; i++){

        let nextX = x + i;
        if(!checkAndAddStep(steps, nextX, y, player, boardState))
            break;
    }

    for (let i = 1; i < sizeX; i++){

        let nextX = x - i;
        if(!checkAndAddStep(steps, nextX, y, player, boardState))
            break;
    }

    for (let i = 1; i < sizeX; i++){

        let nextY = y + i;
        if(!checkAndAddStep(steps, x, nextY, player, boardState))
            break;
    }

    for (let i = 1; i < sizeX; i++){

        let nextY = y - i;
        if(!checkAndAddStep(steps, x, nextY, player, boardState))
            break;
    }

    for (let i = 1; i < sizeX; i++){

        let nextX = x + i;
        let nextY = y + i;

        if(!checkAndAddStep(steps, nextX, nextY, player, boardState))
            break;
    }

    for (let i = 1; i < sizeX; i++){

        let nextX = x - i;
        let nextY = y - i;

        if(!checkAndAddStep(steps, nextX, nextY, player, boardState))
            break;

    }

    for (let i = 1; i < sizeX; i++){

        let nextX = x - i;
        let nextY = y + i;

        if(!checkAndAddStep(steps, nextX, nextY, player, boardState))
            break;
    }

    for (let i = 1; i < sizeX; i++){

        let nextX = x + i;
        let nextY = y - i;

        if(!checkAndAddStep(steps, nextX, nextY, player, boardState))
            break;
    }
    return steps;
}

function getPossibleMovesPawn(cell, boardState){

    if(boardState === undefined)
        boardState = chessState;

    let x = cell.x;
    let y = cell.y;
    let steps = [];
    let player = cell.player;

    if(cell.player === 'white'){

        if(checkFreeSpace(x, y + 1, boardState))
            steps.push({
                x: x,
                y: y + 1,
                capture: false
            });

        if(checkFreeSpace(x, y + 1, boardState) && y === 2 && checkFreeSpace(x, y + 2, boardState) ){
            steps.push({
                x: +x,
                y: +y + 2,
                capture: false
            })
        }
        if(checkCapture(x + 1, y + 1, player, boardState))
            steps.push({
                x: x + 1,
                y: y + 1,
                capture: true
            });
        if(checkCapture(x - 1, y + 1, player,boardState))
            steps.push({
                x: x - 1,
                y: y + 1,
                capture: true
            });

    }

    if(cell.player === 'black'){
        if(checkFreeSpace(x, y - 1,  boardState))
            steps.push({
                x: x,
                y: y - 1,
                capture: false
            });

        if(checkFreeSpace(x, y - 1,  boardState) && y === 7 && checkFreeSpace(x, y - 2, boardState) ){
            steps.push({
                x: x,
                y: y - 2,
                capture: false
            })
        }
        if(checkCapture(x + 1, y - 1, boardState))
            steps.push({
                x: x + 1,
                y: y - 1,
                capture: true
            });
        if(checkCapture(x - 1, y - 1, platboardState))
            steps.push({
                x: x - 1,
                y: y - 1,
                capture: true
            });
    }
    return steps;
}

function getPossibleMovesHorse(cell, boardState){

    if(boardState === undefined)
        boardState = chessState;

    let x = cell.x;
    let y = cell.y;
    let player = cell.player;
    let steps = [];

    let probableMoves = [
        {'x': x - 2, 'y': y - 1},
        {'x': x - 2, 'y': y + 1},
        {'x': x - 1, 'y': y - 2},
        {'x': x - 1, 'y': y + 2},
        {'x': x + 2, 'y': y - 1},
        {'x': x + 2, 'y': y + 1},
        {'x': x + 1, 'y': y - 2},
        {'x': x + 1, 'y': y + 2}
    ];
    for(let i = 0; i< probableMoves.length; i++){
        checkAndAddStep(steps, probableMoves[i].x, probableMoves[i].y, player, boardState);
    }
    return steps;
}

function getPossibleMovesKing(cell, boardState){

    if(boardState === undefined)
        boardState = chessState;

    let x = cell.x;
    let y = cell.y;
    let player = cell.player;
    let steps = [];

    let probableMoves =  [
        {'x': x - 1, 'y': y},
        {'x': x - 1, 'y': y + 1},
        {'x': x - 1, 'y': y - 1},

        {'x': x + 1, 'y': y},
        {'x': x + 1, 'y': y + 1},
        {'x': x + 1, 'y': y - 1},

        {'x': x, 'y': y - 1},
        {'x': x, 'y': y + 1}
    ];
    for(let i = 0; i< probableMoves.length; i++){
        checkAndAddStep(steps, probableMoves[i].x, probableMoves[i].y, player, boardState);
    }

    //long-castling
    if(!chessState.castlingDone[player].done && !chessState.castlingDone[player].leftRookMoved && !chessState.castlingDone[player].kingMoved
        && checkFreeSpace(2, y, boardState) && checkFreeSpace(3, y, boardState) && checkFreeSpace(4, y, boardState)){
        checkAndAddStep(steps,3 ,y, player, boardState);
    }
    if(!chessState.castlingDone[player].done && !chessState.castlingDone[player].rightRookMoved && !chessState.castlingDone[player].kingMoved
        && checkFreeSpace(6, y, boardState) && checkFreeSpace(7, y, boardState)){
        checkAndAddStep(steps,7 ,y, player, boardState);
    }

    return steps;

}

function getPossibleMovesRook(cell, boardState){

    if(boardState === undefined)
        boardState = chessState;

    let x = cell.x;
    let y = cell.y;
    let player = cell.player;
    let steps = [];

    for (let i = 1; i < sizeX; i++){
        let nextY = y + i;
        if(!checkAndAddStep(steps, x, nextY, player, boardState))
            break;
    }
    for (let i = 1; i < sizeX; i++){
        let nextY = y - i;
        if(!checkAndAddStep(steps, x, nextY, player, boardState))
            break;
    }
    for (let i = 1; i < sizeX; i++){
        let nextX = x + i;
        if(!checkAndAddStep(steps, nextX, y, player, boardState))
            break;
    }

    for (let i = 1; i < sizeX; i++){
        let nextX = x - i;
        if(!checkAndAddStep(steps, nextX, y, player, boardState))
            break;
    }
    return steps;
}

function getPossibleMovesBishop(cell, boardState){

    if(boardState === undefined)
        boardState = chessState;

    let y = cell.y;
    let x = cell.x;
    let steps = [];
    let player = cell.player;

    for (let i = 1; i < sizeX; i++){
        let nextY = y + i;
        let nextX = x + i;
        if(!checkAndAddStep(steps, nextX, nextY, player, boardState))
            break;
    }
    for (let i = 1; i < sizeX; i++){
        let nextY = y + i;
        let nextX = x - i;
        if(!checkAndAddStep(steps, nextX, nextY, player, boardState))
            break;
    }
    for (let i = 1; i < sizeX; i++){
        let nextY = y - i;
        let nextX = x - i;
        if(!checkAndAddStep(steps, nextX, nextY, player, boardState))
            break;
    }
    for (let i = 1; i < sizeX; i++){
        let nextY = y - i;
        let nextX = x + i;
        if(!checkAndAddStep(steps, nextX, nextY, player, boardState))
            break;
    }
    return steps;
}

function showSelect(element, capture){

    if(capture && element.classList.contains('white'))
        element.style.backgroundColor = '#ec6f6f';
    else if (capture && element.classList.contains('black'))
        element.style.backgroundColor = '#ef5959';
    else if(element.classList.contains('white')){
        element.style.backgroundColor = '#ffdddd';
    }
    else if(element.classList.contains('black')){
        element.style.backgroundColor = '#e7b1b1';
    }
    element.classList.add('selected');
}

function checkCheck(player, opposite, boardState){

    if(boardState === undefined)
        boardState = chessState;

    let kingX = -1;
    let kingY = -1;
    for(let x = 0; x < sizeX; x++){
        for(let y = 0; y < sizeY; y++){
            let cellInfo = boardState.positions[x][y];
            if(cellInfo.player === player && cellInfo.chessPiece === 'king'){
                kingX = cellInfo.x;
                kingY = cellInfo.y;
            }
        }
    }

    let allSteps = getAllPossibleMoves(opposite);
    return allSteps.filter(item => item.x === kingX && item.y === kingY);
}

function getAllPossibleMoves(player, step){

    let boardState;
    if(step !== undefined){
        boardState = JSON.parse(JSON.stringify(chessState));
        boardState.positions[step[1].x-1][step[1].y-1] = boardState.positions[step[0].x-1][step[0].y-1];
        boardState.positions[step[1].x-1][step[1].y-1].x = step[1].x;
        boardState.positions[step[1].x-1][step[1].y-1].y = step[1].y;
        boardState.positions[step[0].x-1][step[0].y-1] = {
            player: '',
            chessPiece: '',
            x: step[0].x,
            y: step[0].y,
        }
    }
    else
        boardState = chessState;

    let allSteps = [];
    for(let x = 0; x < sizeX; x++){
        for(let y = 0; y < sizeY; y++){
            let cellInfo = boardState.positions[x][y];
            if(cellInfo.player === player){
                let possibleMoves = getPossibleMoves(cellInfo, boardState);
                allSteps.push(...possibleMoves);
            }
        }
    }
    return allSteps;
}

function checkFreeSpace(x, y, boardState){

    if(boardState === undefined)
        boardState = chessState;

    if(x < 1 || y < 1 || x > 8 || y > 8)
        return false;

    return boardState.positions[x - 1][y - 1].player === '';

}

function checkCapture(x, y, player, boardState){

    if(boardState === undefined)
        boardState = chessState;

    if(x < 1 || y < 1 || x > 8 || y > 8)
        return false;
    return boardState.positions[x-1][y-1].player !== player && boardState.positions[x-1][y-1].player !== '';

}

function checkAndAddStep(steps, nextX, nextY, player, boardState){

    if(boardState === undefined)
        boardState = chessState;

    if (checkFreeSpace(nextX, nextY, boardState)){
        steps.push({
            x: nextX,
            y: nextY,
            capture: false
        });
        return true
    }
    else{
        if(checkCapture(nextX, nextY, player, boardState)){
            steps.push({
                x: nextX,
                y: nextY,
                capture: true
            });
        }
        return false
    }
}

function getCell(x,y){
    return document.querySelector(`div[data-x='${x}'][data-y='${y}']`)
}