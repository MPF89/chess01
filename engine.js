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
    chessHistory = [];
    setTurnToMove('white');
    updateStatusBar();
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

    let x = +this.dataset.x;
    let y = +this.dataset.y;

    let cellInfo = chessState.positions[x-1][y-1];

    if(chessState.selected.x > 0 && chessState.selected.y > 0){

        let selectedInfo = chessState.positions[chessState.selected.x-1][chessState.selected.y-1];
        let possibleMoves = getPossibleMoves(selectedInfo);

        for (let i = 0; i<possibleMoves.length; i++){
            if(x === possibleMoves[i].x && y === possibleMoves[i].y){

                let opposite;

                if(chessState.turnToMove === 'white')
                    opposite = 'black'
                else if (chessState.turnToMove === 'black')
                    opposite = 'white';



                console.log(chessHistory);

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
                let check = checkCheck(chessState.turnToMove, opposite);
                changeTurnToMove();

                let checkCell = document.querySelector('.check');
                if(checkCell !== null) {
                    checkCell.classList.remove('check');
                    checkCell.style.removeProperty('background-color');
                }

                for (let i = 0; i<check.length; i++){
                    checkCell = getCell(check[i].x, check[i].y);
                    checkCell.classList.add('check');
                    checkCell.style.backgroundColor = '#dc1e1e';
                }

                addHistory(selectedInfo.player, {x: selectedInfo.x, y: selectedInfo.y}, {
                    x: x,
                    y: y
                }, selectedInfo.chessPiece, check.length>0);

                showHistory();
                updateStatusBar();
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
    updateStatusBar();
}

function getOpposite(player){

    if(player === 'white')
        return 'black';
    else if (player === 'black')
        return  'white';
    else
        return '';
}

function getPossibleMoves(cell, boardState, itsCheckCheck = false){

    switch (cell.chessPiece){
        case 'pawn':
            return getPossibleMovesPawn(cell, boardState, itsCheckCheck);
        case 'queen':
            return getPossibleMovesQueen(cell, boardState, itsCheckCheck);
        case 'horse-left':
        case 'horse-right':
            return getPossibleMovesHorse(cell, boardState, itsCheckCheck);
        case 'king':
            return getPossibleMovesKing(cell, boardState, itsCheckCheck);
        case 'rook':
            return getPossibleMovesRook(cell, boardState, itsCheckCheck);
        case 'bishop':
            return getPossibleMovesBishop(cell, boardState, itsCheckCheck);
    }
}

function getPossibleMovesQueen(cell, boardState, itsCheckCheck = false){

    let possibleMovesRook = getPossibleMovesRook(cell, boardState, itsCheckCheck);
    let possibleMovesBishop = getPossibleMovesBishop(cell, boardState, itsCheckCheck);
    return [...possibleMovesRook,...possibleMovesBishop];

}

function getPossibleMovesPawn(cell, boardState, itsCheckCheck = false) {

    if (boardState === undefined)
        boardState = chessState;

    let x = cell.x;
    let y = cell.y;
    let steps = [];
    let player = boardState.turnToMove;
    let opposite = getOpposite(player);

    if (player === 'white') {

        if (checkFreeSpace(x, y + 1, boardState)) {
            if (itsCheckCheck || !isCheck(player, opposite, boardState, [{x: cell.x, y: cell.y}, {x: x, y: y + 1}]))
                steps.push({
                    x: x,
                    y: y + 1,
                    capture: false
                });
        }


        if (checkFreeSpace(x, y + 1, boardState) && y === 2 && checkFreeSpace(x, y + 2, boardState)) {
            if (itsCheckCheck || !isCheck(player, opposite, boardState, [{x: cell.x, y: cell.y}, {x: x, y: y + 2}])) {
                steps.push({
                    x: x,
                    y: y + 2,
                    capture: false
                })
            }
        }

        if (checkCapture(x + 1, y + 1, player, boardState))
            if (itsCheckCheck || !isCheck(player, opposite, boardState, [{x: cell.x, y: cell.y}, {
                x: x + 1,
                y: y + 1
            }])) {
                steps.push({
                    x: x + 1,
                    y: y + 1,
                    capture: true
                });
            }

        if (checkCapture(x - 1, y + 1, player, boardState))

            if (itsCheckCheck || !isCheck(player, opposite, boardState, [{x: cell.x, y: cell.y}, {
                x: x - 1,
                y: y + 1
            }])) {
                steps.push({
                    x: x - 1,
                    y: y + 1,
                    capture: true
                });
            }
    }

    if (player === 'black') {
        if (checkFreeSpace(x, y - 1, boardState)) {
            if (itsCheckCheck || !isCheck(player, opposite, boardState, [{x: cell.x, y: cell.y}, {x: x, y: y - 1}])) {
                steps.push({
                    x: x,
                    y: y - 1,
                    capture: false
                });
            }
        }


        if (checkFreeSpace(x, y - 1, boardState) && y === 7 && checkFreeSpace(x, y - 2, boardState)) {
            if (itsCheckCheck || !isCheck(player, opposite, boardState, [{x: cell.x, y: cell.y}, {x: x, y: y - 2}])) {
                steps.push({
                    x: x,
                    y: y - 2,
                    capture: false
                });
            }
        }

        if (checkCapture(x + 1, y - 1, boardState)) {
            if (itsCheckCheck || !isCheck(player, opposite, boardState, [{x: cell.x, y: cell.y}, {
                x: x + 1,
                y: y - 1
            }])) {
                steps.push({
                    x: x + 1,
                    y: y - 1,
                    capture: true
                });
            }
        }
        if (checkCapture(x - 1, y - 1, boardState)) {
            if (itsCheckCheck || !isCheck(player, opposite, boardState, [{x: cell.x - 1, y: cell.y - 1}, {
                x: x - 1,
                y: y - 1
            }])) {
                steps.push({
                    x: x - 1,
                    y: y - 1,
                    capture: true
                });
            }
        }
    }
    return steps;
}

function getPossibleMovesHorse(cell, boardState, itsCheckCheck = false){

    if(boardState === undefined)
        boardState = chessState;

    let x = cell.x;
    let y = cell.y;
    let player = boardState.turnToMove;
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
        checkAndAddStep(steps, x, y, probableMoves[i].x, probableMoves[i].y, player, boardState, itsCheckCheck);
    }
    return steps;
}

function getPossibleMovesKing(cell, boardState, itsCheckCheck = false){

    if(boardState === undefined)
        boardState = chessState;

    let x = cell.x;
    let y = cell.y;
    let player = boardState.turnToMove;
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
        checkAndAddStep(steps, x, y, probableMoves[i].x, probableMoves[i].y, player, boardState, itsCheckCheck);
    }

    //long-castling
    if(!chessState.castlingDone[player].done && !chessState.castlingDone[player].leftRookMoved && !chessState.castlingDone[player].kingMoved
        && checkFreeSpace(2, y, boardState) && checkFreeSpace(3, y, boardState) && checkFreeSpace(4, y, boardState)){
        checkAndAddStep(steps, x, y,3 ,y, player, boardState, itsCheckCheck);
    }
    if(!chessState.castlingDone[player].done && !chessState.castlingDone[player].rightRookMoved && !chessState.castlingDone[player].kingMoved
        && checkFreeSpace(6, y, boardState) && checkFreeSpace(7, y, boardState)){
        checkAndAddStep(steps,x, y,7 ,y, player, boardState, itsCheckCheck);
    }

    return steps;

}

function getPossibleMovesRook(cell, boardState, itsCheckCheck = false){

    if(boardState === undefined)
        boardState = chessState;

    let x = cell.x;
    let y = cell.y;
    let player = boardState.turnToMove;
    let steps = [];

    for (let i = 1; i < sizeX; i++){
        let nextY = y + i;
        if(!checkAndAddStep(steps, x, y, x, nextY, player, boardState, itsCheckCheck))
            break;
    }
    for (let i = 1; i < sizeX; i++){
        let nextY = y - i;
        if(!checkAndAddStep(steps, x, y, x, nextY, player, boardState, itsCheckCheck))
            break;
    }
    for (let i = 1; i < sizeX; i++){
        let nextX = x + i;
        if(!checkAndAddStep(steps, x, y, nextX, y, player, boardState, itsCheckCheck))
            break;
    }

    for (let i = 1; i < sizeX; i++){
        let nextX = x - i;
        if(!checkAndAddStep(steps, x, y, nextX, y, player, boardState, itsCheckCheck))
            break;
    }
    return steps;
}

function getPossibleMovesBishop(cell, boardState, itsCheckCheck = false){

    if(boardState === undefined)
        boardState = chessState;

    let y = cell.y;
    let x = cell.x;
    let steps = [];
    let player = cell.player;

    for (let i = 1; i < sizeX; i++){
        let nextY = y + i;
        let nextX = x + i;
        if(!checkAndAddStep(steps, x, y, nextX, nextY, player, boardState, itsCheckCheck))
            break;
    }
    for (let i = 1; i < sizeX; i++){
        let nextY = y + i;
        let nextX = x - i;
        if(!checkAndAddStep(steps, x, y, nextX, nextY, player, boardState, itsCheckCheck))
            break;
    }
    for (let i = 1; i < sizeX; i++){
        let nextY = y - i;
        let nextX = x - i;
        if(!checkAndAddStep(steps, x, y, nextX, nextY, player, boardState, itsCheckCheck))
            break;
    }
    for (let i = 1; i < sizeX; i++){
        let nextY = y - i;
        let nextX = x + i;
        if(!checkAndAddStep(steps,x, y, nextX, nextY, player, boardState, itsCheckCheck))
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

function isCheck(player, opposite, boardState, step){
    return checkCheck(player, opposite, boardState, step).length !== 0;
}

function checkCheck(player, opposite, boardState, step){

    if(boardState === undefined)
        boardState = chessState;

    let kingX = -1;
    let kingY = -1;
    if (step !== undefined && boardState.positions[step[0].x - 1][step[0].y - 1].chessPiece === 'king') {

        kingX = step[1].x;
        kingY = step[1].y;

    }
    else{
        for(let x = 0; x < sizeX; x++){
            for(let y = 0; y < sizeY; y++){
                let cellInfo = boardState.positions[x][y];
                if(cellInfo.player === player && cellInfo.chessPiece === 'king'){
                    kingX = cellInfo.x;
                    kingY = cellInfo.y;
                }
            }
        }
    }


    let allSteps = getAllPossibleMoves(opposite, step, true);
    return allSteps.filter(item => item.x === kingX && item.y === kingY);
}

function getAllPossibleMoves(player, step, itsCheckCheck = false){

    let boardState;

    boardState = JSON.parse(JSON.stringify(chessState));
    boardState.turnToMove = player;

    if(step !== undefined){
        boardState.positions[step[1].x - 1][step[1].y - 1] = boardState.positions[step[0].x - 1][step[0].y - 1];
        boardState.positions[step[1].x - 1][step[1].y - 1].x = step[1].x;
        boardState.positions[step[1].x - 1][step[1].y - 1].y = step[1].y;
        boardState.positions[step[0].x - 1][step[0].y - 1] = {
            player: '',
            chessPiece: '',
            x: step[0].x,
            y: step[0].y,
        }
    }
    let allSteps = [];
    for(let x = 0; x < sizeX; x++){
        for(let y = 0; y < sizeY; y++){
            let cellInfo = boardState.positions[x][y];
            if(cellInfo.player === player){
                let possibleMoves = getPossibleMoves(cellInfo, boardState, itsCheckCheck);
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

function checkAndAddStep(steps, xNow, yNow, nextX, nextY, player, boardState, itsCheckCheck = false){

    if(boardState === undefined)
        boardState = chessState;

    let opposite = getOpposite(player);

    if(!itsCheckCheck
        && (checkFreeSpace(nextX, nextY, boardState) || checkCapture(nextX, nextY, player, boardState))
        && (nextX >= 1 && nextY >= 1 && nextX <= sizeX && nextY <= sizeY)
        && isCheck(player, opposite, boardState, [{x: xNow, y: yNow}, {x: nextX, y: nextY}])){
        return true;
    }

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

function updateStatusBar() {
    let statusBar = document.querySelector('#status-bar');
    if (chessState.turnToMove === '') {
        statusBar.innerHTML = "&uarr; For start press <span class=\"text-success\">new game</span> &uarr;";
    } else {
        let statusBarText = `${chessState.turnToMove}'s move`;
        statusBar.innerHTML = statusBarText[0].toUpperCase() + statusBarText.slice(1);
    }
}

function addHistory(player, from, to, chessPiece, check) {

    if(player === 'black' && chessHistory.length === 0){
        addHistory('white', {x:-1, y: -1}, {x:-1, y:-1}, '')
    }

    let abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    let pieceName = '';
    switch (chessPiece){
        case 'queen':
            pieceName = 'Q';
            break;
        case 'horse-left':
        case 'horse-right':
            pieceName = 'N';
            break;
        case 'king':
            pieceName = 'K';
            break;
        case 'rook':
            pieceName = 'R';
            break;
        case 'bishop':
            pieceName = 'B';
            break;
    }

    let representation = `${pieceName}${abc[from.x-1]}${from.y}-${abc[to.x-1]}${to.y}`;
    if(check)
        representation += '+';

    chessHistory.push({
        player: player,
        from: from,
        to: to,
        check: check,
        representation: representation
    });
}

function showHistory(){
    if(chessHistory.length === 0){
        return;
    }
    let history = document.querySelector('.right-block');

    let innerHTML = '<p class="history h5">History:</p>';

    let stepNumber = Math.ceil(chessHistory.length / 2);

    innerHTML += '<p><strong>' + stepNumber + '</strong>';
    for(let i = chessHistory.length-1; i>=0; i--){

        let stepNumberNext = Math.ceil(i / 2);
        if(stepNumber !== stepNumberNext){
            innerHTML += '</p><p><strong>' + stepNumberNext + '</strong>';
            stepNumber = stepNumberNext;
        }
        innerHTML += chessHistory[i].representation + ' ';
    }
    innerHTML +='</p>';
    history.innerHTML = innerHTML;
}