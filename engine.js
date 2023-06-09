function drawBoard(functionClick){

    let chessboard = document.querySelector('#chessboard');
    chessboard.classList.add('chessboard');
    chessboard.innerHTML = '';
    chessState.positions = getClearPositions();

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

            divSquare.onclick = functionClick;

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

function iniStandard(itsLoading = false, itsEdit = false){

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

    if(!itsEdit){
        hideSelectPawnMenu();
        startGame('white', 'iniStandard', itsLoading);
    }
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

function changePlayer(){

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

    clearContainer();
    stopTimer();

    const url = document.location.pathname + "?do=newGame";
    window.history.replaceState(null, null, url);

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
        chessState.single = true;
        drawBoard(showSteps);
        iniStandard();
    });

    let newButtonRemote = document.createElement('button');
    newButtonRemote.textContent = "REMOTE GAME";
    newButtonRemote.classList.add('col-4', 'rounded');
    newButtonRemote.addEventListener('click', ()=>{
        createRemoteGame();
    });

    divButton.append(spanH1);
    divButton.append(newButtonThisPC);
    divButton.append(spanLabelThisPC);
    divButton.append(newButtonRemote);

    let chessboard = document.querySelector('#chessboard');
    chessboard.append(divButton);

    chessHistory = [];
}

function createRemoteGame(){

    clearContainer();
    drawBoard(showSteps);
    chessState.single = false;
    iniStandard();
    chessState.status = 'game';
    updateStatusBar();
}

function clearContainer(){

    let chessboard = document.querySelector('#chessboard');
    chessboard.classList.add('chessboard');
    chessboard.innerHTML = '';

    let leftBoard = document.querySelector('#left-block');
    leftBoard.innerHTML = '';

    let buttonsDiv = document.querySelector('#downButtons');
    buttonsDiv.innerHTML = '';

    let divStatus = document.querySelector('#status-bar');
    divStatus.innerHTML = '';

}

function stopTimer(){
    if(timerId !== null)
        clearTimeout(timerId);
    timerId = null;
}

function showSelectPawnMenu(player, x, y, capture) {

    let leftBlock = document.querySelector('.left-block');
    let pH5 = document.createElement('p');
    pH5.classList.add('h5', 'history');
    pH5.textContent = 'Select piece:';
    leftBlock.append(pH5);

    createSmallBoard(leftBlock, 2,2);

    let allDivSquares = document.querySelectorAll('.smallSquare');
    let pieces = ['queen', 'horse-right', 'rook', 'bishop'];

    for(let i = 0; i<allDivSquares.length; i++){
        allDivSquares[i].onclick = makePromotion;
        allDivSquares[i].setAttribute('data-fromX', x);
        allDivSquares[i].setAttribute('data-fromY', y);
        allDivSquares[i].setAttribute('data-piece', pieces[i]);
        allDivSquares[i].setAttribute('data-capture', capture);
        allDivSquares[i].innerHTML = "<img src='images/pieces/" + player + '/' + pieces[i] + ".png' alt='"+ pieces[i] + "' class='img-pieces'>";
    }
    soundClick();
}

function makePromotion(){

    let player;
    if(chessState.turnToMove === 'wait-black')
        player = 'black';
    else
        player = 'white';
    setTurnToMove(getOpposite(player));
    setPiece(player,this.dataset.piece, this.dataset.fromx, this.dataset.fromy);

    let pieceName = getShotPieceName(this.dataset.piece);

    let checkMateInfo = checkAndSetupCheckAndMate();
    let isCapture = this.dataset.capture;

    addHistory(player, {x: chessState.selected.x, y:chessState.selected.y},
        {x: this.dataset.fromx, y: this.dataset.fromy}, 'pawn', checkMateInfo.check, false, false,
        checkMateInfo.checkAndMate, checkMateInfo.pat, isCapture, false, pieceName);

    chessState.selected.x = -1;
    chessState.selected.y = -1;

    updateCheckAndMateInfo(checkMateInfo);
    hideSelectPawnMenu();
    updateStatusBar();
    showHistory();
}

function createSmallBoard(leftBlock, x, y) {
    for (let i = 0; i < y; i++) {

        let divLine = document.createElement('div');
        divLine.classList.add('smallRow');

        for (let k = 0; k < x; k++) {
            let divSquare = document.createElement('div');
            divSquare.classList.add('smallSquare');
            divLine.append(divSquare);
        }

        leftBlock.append(divLine);
    }
}

function hideSelectPawnMenu(){
    let leftBlock = document.querySelector('.left-block');
    leftBlock.innerHTML = '';
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

                let itsLongCastling = false;
                let itsShotCastling = false;
                if(cellInfo.chessPiece === 'king' && x === 3 && chessState.selected.x === 5){
                    setPiece(cellInfo.player, 'rook', 4, y);
                    setPiece('', '', 1, selectedInfo.y);
                    itsLongCastling = true;
                }

                if(cellInfo.chessPiece === 'king' && x === 7 && chessState.selected.x === 5){
                    setPiece(cellInfo.player, 'rook', 6, y);
                    setPiece('', '', 8, selectedInfo.y);
                    itsShotCastling = true;
                }

                let enPassant = false;
                if(cellInfo.chessPiece === 'pawn' && y === 1 && chessState.turnToMove === 'black'){

                    showSelectPawnMenu('black', x, y, possibleMoves[i].capture);
                    chessState.turnToMove = 'wait-black';
                    return;
                }
                 else if (cellInfo.chessPiece === 'pawn' && y === 8 && chessState.turnToMove === 'white'){
                    showSelectPawnMenu('white', x, y, possibleMoves[i].capture);
                    chessState.turnToMove = 'wait-white';
                    return;
                } else if (cellInfo.chessPiece === 'pawn' && selectedInfo.x !== x ){

                     let prevMove = getLastMove();
                     if(prevMove !== undefined
                         && prevMove.chessPiece === 'pawn'
                         && Math.abs(prevMove.from.y - prevMove.to.y) === 2){

                         if (cellInfo.player === 'white')
                             setPiece('', '', x, y-1);
                         else if(cellInfo.player === 'black')
                             setPiece('', '', x, y+1);

                         enPassant = true;
                     }

                }

                chessState.selected = {
                    x: -1,
                    y: -1,
                    chessPiece: '',
                }

                changePlayer();

                let opposite = getOpposite(chessState.turnToMove);
                let checkMateInfo = checkAndSetupCheckAndMate();

                updateCheckAndMateInfo(checkMateInfo);

                addHistory(opposite, {x: selectedInfo.x, y: selectedInfo.y}, {
                        x: x,
                        y: y
                    },
                    cellInfo.chessPiece, checkMateInfo.check,
                    itsShotCastling, itsLongCastling,
                    checkMateInfo.checkAndMate, checkMateInfo.pat,  possibleMoves[i].capture, enPassant);
                soundClick();
                showHistory();
                updateStatusBar();
                return;
            }
        }
    }

    let playerFromURL = getPlayerFromURL();

    if(cellInfo.player === chessState.turnToMove && (chessState.single || playerFromURL === chessState.turnToMove)){

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

function checkAndSetupCheckAndMate(){

    let opposite = getOpposite(chessState.turnToMove);
    let check = checkCheck(chessState.turnToMove, opposite);

    let isCheckAndMate = false;
    let allPossibleMoves = getAllPossibleMoves(chessState.turnToMove)
    if(check.length > 0 && allPossibleMoves.length === 0){
        chessState.winner = opposite;
        chessState.finished = true;
        isCheckAndMate = true;
    }

    let isPat = false;
    if(check.length === 0 && allPossibleMoves.length === 0){
        chessState.winner = 'pat';
        chessState.finished = true;
        isPat = true;
    }
    return {
        check: check.length > 0,
        checkAndMate: isCheckAndMate,
        pat: isPat,
        checkCells: check
    }
}

function updateCheckAndMateInfo(checkMateInfo){
    let checkCell = document.querySelector('.check');
    if(checkCell !== null) {
        checkCell.classList.remove('check');
        checkCell.style.removeProperty('background-color');
    }

    for (let i = 0; i<checkMateInfo.checkCells.length; i++){
        checkCell = getCell(checkMateInfo.checkCells[i].x, checkMateInfo.checkCells[i].y);
        checkCell.classList.add('check');
        checkCell.style.backgroundColor = '#dc1e1e';
    }
}

function getAllPossibleMoves(player, step = undefined, itsCheckCheck = false){

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
        default:
            return [];
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

    let prevMove = getLastMove();

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

        if (checkCapture(x + 1, y - 1, player, boardState))
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

        if (checkCapture(x - 1, y - 1, player, boardState))
            if (itsCheckCheck || !isCheck(player, opposite, boardState, [{x: cell.x, y: cell.y}, {
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

    if(prevMove !== undefined
        && prevMove.chessPiece === 'pawn'
        && Math.abs(prevMove.from.y - prevMove.to.y) === 2
        && Math.abs(prevMove.from.x - x) === 1
        && prevMove.to.y === y){

        if(prevMove.player === 'black'){
            steps.push({
                x: prevMove.from.x,
                y: y + 1,
                capture: true
            });
        }
        if(prevMove.player === 'white'){
            steps.push({
                x: prevMove.from.x,
                y: y - 1,
                capture: true
            });
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

    if(!itsCheckCheck){

        if(chessState.turnToMove === 'black' && y !==8)
            return steps;
        if(chessState.turnToMove === 'white' && y !==1)
            return steps;


        if(!chessState.castlingDone[player].done && !chessState.castlingDone[player].leftRookMoved && !chessState.castlingDone[player].kingMoved
            && checkFreeSpace(2, y, boardState) && checkFreeSpace(3, y, boardState) && checkFreeSpace(4, y, boardState)
            && chessState.positions[0][y-1].chessPiece==='rook'){

            let opposite = getOpposite(player);
            let allPossibleMoves = getAllPossibleMoves(opposite, undefined, true);
            let filterPossibleMoves = allPossibleMoves.filter(item=>{
                return (item.x >= 3 && item.x<=5) && item.y===y
            });
            if(filterPossibleMoves.length === 0)
                checkAndAddStep(steps, x, y,3 ,y, player, boardState, itsCheckCheck);
        }
        if(!chessState.castlingDone[player].done && !chessState.castlingDone[player].rightRookMoved && !chessState.castlingDone[player].kingMoved
            && checkFreeSpace(6, y, boardState) && checkFreeSpace(7, y, boardState)
            && chessState.positions[7][y-1].chessPiece==='rook'){

            let opposite = getOpposite(player);
            let allPossibleMoves = getAllPossibleMoves(opposite, undefined, true);
            let filterPossibleMoves = allPossibleMoves.filter(item => item.x >= 5 && item.x<=7 && item.y===y);
            if(filterPossibleMoves.length === 0)
                checkAndAddStep(steps,x, y,7 ,y, player, boardState, itsCheckCheck);
        }
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

function showHistory(){

    let history = document.querySelector('#history');

    if(chessHistory.length === 0){
        history.innerHTML = "";
        return;
    }

    if(toHideHistory) {
        history.style.visibility = "hidden";
        history.style.display = 'none';
        return;
    } else{
        history.style.visibility = "visible";
        history.style.display = 'flex';
    }

    let innerHTML = '';

    let stepNumber = Math.ceil(chessHistory.length / 2);

    let whiteStep = '';
    let blackStep = '';

    innerHTML += '<p><strong>' + stepNumber + '. </strong>';
    for(let i = chessHistory.length-1; i>=0; i--){

        let stepNumberNext = Math.ceil((i + 1)/ 2);

        if(stepNumber !== stepNumberNext){
            innerHTML += whiteStep;
            innerHTML += blackStep;
            whiteStep = '';
            blackStep = '';
            innerHTML += '</p><p><strong>' + stepNumberNext + '. </strong>';
            stepNumber = stepNumberNext;
        }
        if(chessHistory[i].player === 'black')
            blackStep = '<a class="move-number" data-moveNumber="'+ i + '"><span data-moveNumber="'+ i + '">'+ chessHistory[i].representation + ' </span></a>';
        else if (chessHistory[i].player === 'white')
            whiteStep = '<a class="move-number" data-moveNumber="'+ i + '"><span data-moveNumber="'+ i + '">'+ chessHistory[i].representation + ' </span></a>';
    }
    innerHTML += whiteStep + blackStep + '</p>';
    history.innerHTML = innerHTML;

    if(chessState.status !== 'arrange'){
        let pButtonHistory = document.querySelector('#button-history');
        pButtonHistory.innerHTML = '<p class="history h5" id="button-history">History: (<a href="#" id="button-hide">hide</a>) </p>';
        document.querySelector('#button-hide').onclick = hideShowHistory;
    }
    else{
        let pButtonHistory = document.querySelector('#button-history');
        pButtonHistory.innerHTML = '<p class="history h5" id="button-history">History:</p>';
    }
}

function hideShowHistory(){

    toHideHistory = !toHideHistory;

    let history = document.querySelector('#history');
    if(toHideHistory){
        this["textContent"] = 'show';
        history.style.visibility = "hidden";
        showHistory();
    }
    else{
        this["textContent"] = 'hide';
        history.style.visibility = "visible";
        showHistory();
    }
}

function createGameHistory(initialLocation){

    let guid = getRandomString(16);
    const url = document.location.pathname + "?game=" + guid;
    window.history.replaceState(null, null, url);

    chessState.initialLocation = initialLocation;

}

function saveHistory(itsLoading = false) {

    //clear old history:
    let games;
    if(localStorage.hasOwnProperty('games_id')){
        try{
            games = JSON.parse(localStorage.getItem('games_id'));
            if(games.length>historyLimit){
                games.sort(gamesSort);
                while(games.length > historyLimit){
                    let deleted = games.pop();
                    localStorage.removeItem('game_' + deleted.id);
                }
            }
        }
        catch (error){
            console.error(error);
            games = [];
            localStorage.setItem('games_id', JSON.stringify([]));
        }
    }
    else{
        games = [];
        localStorage.setItem('games_id', JSON.stringify([]));
    }

    let paramsString = document.location.search;
    let getParams = new URLSearchParams(paramsString);

    if(getParams.has('game')){

        let gameId = getParams.get('game');
        if(gameId.length !== 16)
            return;
        let shotHistory = chessHistory.map(item=> {
            return [
                ""+item.from.x+item.from.y+item.to.x+item.to.y,
                item.representation
            ]
        });
        let time = new Date().getTime();
        let startTime = chessState.startTime;
        let startPositions = chessState.initialLocation;

        localStorage.setItem('game_' + gameId, JSON.stringify({
            time: time,
            startTime: startTime,
            single: chessState.single,
            startPosition: startPositions,
            history: shotHistory
        }));

        let gameFounded = false;
        for(let i=0; i<games.length; i++){
            if(games[i].id === gameId){
                gameFounded = true;
                games[i].time = time;
            }
        }
        if(!gameFounded){
            games.push({id: gameId, time: time})
        }
    }
    let now = new Date();
    localStorage.setItem('games_id', JSON.stringify(games));

    if(!itsLoading)
        saveHistoryOnServer();

    updateStatusSave("Saved local " +now.toString()) ;
}

function saveHistoryOnServer(){

    let paramsString = document.location.search;
    let getParams = new URLSearchParams(paramsString);

    fetch('api/api.php?action=saveHistory', {
        method: 'POST',
        body: JSON.stringify({
            gameId: getParams.get('game'),
            single: chessState.single,
            startPosition: chessState.initialLocation,
            moveNumber: chessHistory.length,
            history: JSON.stringify(chessHistory),
        })
    })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'error'){
                updateStatusSave("Error: " + data.error);
                console.error(data.message);
            }
            else{
                updateStatusSave("Saved online " + new Date().toString());
            }
        })
        .catch((error) => {
            updateStatusSave("Error save online: " + error);
            console.error('Error:', error);
        });
}

function getOpposite(player){

    if(player === 'white')
        return 'black';
    else if (player === 'black')
        return  'white';
    else
        return '';
}

function arrange(gameData, moveNumber = undefined){

    clearContainer();
    stopTimer();

    const url = document.location.pathname + "?do=arrange";
    window.history.replaceState(null, null, url);

    chessState.status = 'arrange';

    let leftBoard = document.querySelector('.left-block');
    leftBoard.innerHTML = '';

    let divSelect = document.createElement('div');
    divSelect.classList.add('arrange-board');

    leftBoard.append(divSelect);

    let divBoard = document.createElement('div');
    divBoard.classList.add('arrange-board');
    leftBoard.append(divBoard);

    let allFigures = [
        ['white', 'rook'],
        ['white', 'horse-left'],
        ['white', 'bishop'],
        ['white', 'queen'],
        ['white', 'king'],
        ['white', 'pawn'],

        ['black', 'rook'],
        ['black', 'horse-left'],
        ['black', 'bishop'],
        ['black', 'queen'],
        ['black', 'king'],
        ['black', 'pawn'],

        ['noOne', 'trash']

    ];

    for (let x = 0; x < 13; x++) {
        let divSquare = document.createElement('div');
        divSquare.classList.add('arrange-square', 'square');
        divSquare.setAttribute('data-player', allFigures[x][0]);
        divSquare.setAttribute('data-piece', allFigures[x][1]);

        divSquare.innerHTML = "<img src='images/pieces/" + allFigures[x][0] + '/' + allFigures[x][1] + ".png' alt='"
            + allFigures[x][1] + "' class='img-pieces'>";
        divSquare.onclick = arrangeSelect;

        divBoard.append(divSquare);
    }

    let divButtons = document.querySelector('#downButtons');
    divButtons.innerHTML = '';

    let elSelect = document.createElement('select');
    elSelect.setAttribute('id', 'selectMove');

    let optionWhites = document.createElement('option');
    optionWhites.dataset.player = 'white';
    optionWhites.textContent = "White's move";
    optionWhites.id = 'optionWhites';

    let optionBlacks = document.createElement('option');
    optionBlacks.dataset.player = 'black';
    optionBlacks.textContent = "Black's move";
    optionBlacks.id = 'optionBlacks';

    elSelect.append(optionWhites);
    elSelect.append(optionBlacks);
    elSelect.classList.add('form-select-sm', 'form-check-inline');
    divButtons.append(elSelect);

    let startButton = document.createElement('button');
    startButton.innerText = 'Start';
    startButton.onclick = startArranges;
    startButton.classList.add('btn-success');
    divButtons.append(startButton);

    updateStatusBar();

    chessHistory = [];
    showHistory();
    drawBoard(arrangeBoardSelect);

    if(gameData !== undefined && gameData.hasOwnProperty('startPosition')){
        drawPositionsWithHistory(gameData, false, true, moveNumber);
    }
}

function arrangeSelect(){

    let selectedArrange = document.getElementsByClassName('selected');

    for (let i = selectedArrange.length - 1; i >= 0 ; i--){
        selectedArrange[i].style.removeProperty('background-color');
        selectedArrange[i].classList.remove('selected');
    }

    this.classList.add('selected');
}

function arrangeBoardSelect(){
    let selectedArrange = document.getElementsByClassName('selected');

    if(selectedArrange.length > 0){
        let arrangeDiv = selectedArrange[0];
        let piece = arrangeDiv.dataset.piece;
        let player = arrangeDiv.dataset.player;
        let x = this.dataset.x;
        let y = this.dataset.y;
        if(piece !== 'trash')
            setPiece(player, piece, x, y);
        else
            setPiece('', '', x, y);
    }
}

function startArranges(){

    let squares = document.getElementsByClassName('square');
    for(let i = 0; i<squares.length; i++){
        squares[i].onclick = showSteps;
    }

    let playerOptions = document.querySelector('#selectMove')
    let selected = playerOptions.selectedOptions[0];

    hideSelectPawnMenu();
    chessState.single = true;
    startGame(selected.dataset.player, JSON.stringify(chessState.positions));
}

function startGame(player, startPositions, loading = false){
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
    chessState.winner = '';
    chessState.finished = false;
    chessState.startTime = new Date().getTime();
    chessState.status = 'game';
    chessHistory = [];

    let divButtons = document.querySelector('#downButtons');
    divButtons.innerHTML = '';

    setTurnToMove(player);
    updateStatusBar();
    showHistory();
    if(!loading)
        createGameHistory(startPositions);

    saveHistory();

    stopTimer();
    if(!chessState.single)
        timerId = setTimeout(checkUpdateGame, timeOut);
}

async function loadGame(){

    let paramsString = document.location.search;
    let getParams = new URLSearchParams(paramsString);

    if(getParams.has('game')){
        let gameId = getParams.get('game');

        if(gameId.length !== 16)
            return;

        let isLocalActual = true;
        let isOnlineActual = false;

        let dataJSON = localStorage.getItem('game_' + gameId);
        if(dataJSON === null)
            isLocalActual = false;

        try{

            let dataLocal = JSON.parse(dataJSON);
            chessState.positions = getClearPositions();
            let fetchResponse = await fetch('api/api.php?action=loadHistory&gameId=' + gameId);

            if(!fetchResponse.ok){
                isOnlineActual = false;
            }
            let dataOnline = await fetchResponse.json();
            if(dataOnline.status === 'error'){
                isLocalActual = true;
                isOnlineActual = false;
            }
            else {
                if(dataLocal===null || dataOnline.history.length > dataLocal.history.length){
                    isLocalActual = false;
                    isOnlineActual = true;
                }
                else {
                    isOnlineActual = false;
                    isLocalActual = true;
                }
            }

            drawBoard(showSteps);
            if(isLocalActual)
                drawPositionsWithHistory(dataLocal, false, true);
            else if(isOnlineActual)
                drawPositionsWithHistory(dataOnline, false, true);

            saveHistory();
            showHistory();

            stopTimer();
            timerId = setTimeout(checkUpdateGame, timeOut);
        }
        catch (error){
            console.log(error);
        }
    updateStatusBar();
    }
}

function drawPositionsWithHistory(data, itsLoading, itsEdit, moveNumber){

    if (data.startPosition === 'iniStandard') {
        iniStandard(itsLoading, itsEdit);
        chessState.initialLocation = 'iniStandard';
    } else {
        let startPositions = JSON.parse(data.startPosition);
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                setPiece(
                    startPositions[x][y].player,
                    startPositions[x][y].chessPiece,
                    startPositions[x][y].x,
                    startPositions[x][y].y);
            }
        }
        chessState.initialLocation = JSON.stringify(chessState.positions);
    }
    chessState.single = Boolean(data.single);
    chessHistory = [];
    let limit = data.history.length;
    if(moveNumber !== undefined)
        limit = moveNumber;

    let selectMove = document.querySelector('#selectMove');
    if(limit % 2 === 0 && selectMove!==null)
        selectMove.selectedIndex = 0;
    else if(selectMove !== null)
        selectMove.selectedIndex = 1;

    for (let i = 0; i < data.history.length; i++) {

        let player;

        if (i % 2 === 0)
            player = 'white';
        else
            player = 'black';

        let description = data.history[i][1];

        if(description === '...'){
            continue;
        }

        let xFrom = +data.history[i][0][0];
        let yFrom = +data.history[i][0][1];

        let xTo = +data.history[i][0][2];
        let yTo = +data.history[i][0][3];

        let piece = chessState.positions[xFrom - 1][yFrom - 1].chessPiece;

        let isCheck = description.indexOf('+') !== -1;
        let isCheckAndMate = description.indexOf('#') !== -1;
        let isPat = description.indexOf('=') !== -1;
        let isCapture = description.indexOf('x') !== -1;
        let isLongCastle = description === '0-0-0';
        let isShotCastle = description === '0-0';
        let isEnPassant = description.indexOf('e.p.') !==-1;

        let transformation = '';

        if(!isLongCastle && !isShotCastle &&!isEnPassant && description.length > 5 && getShotPieceName(piece) === ''){
            transformation = description[description.length - 1];
        }

        addHistory(player, {x: xFrom, y: yFrom}, {x: xTo, y: yTo}, piece, isCheck, isShotCastle, isLongCastle,
            isCheckAndMate, isPat, isCapture, isEnPassant, transformation, description, true)
        if(i<=limit){
            setPiece('', '', xFrom, yFrom);
            setPiece(player, piece, xTo, yTo);

            if(isEnPassant){
                if(player === 'white'){
                    setPiece('', '', xTo, yTo - 1);
                }
                else if (player === 'black'){
                    setPiece('', '', xTo, yTo + 1);
                }
            }

            if(isLongCastle){
                setPiece(player, 'rook', 4, yTo);
                setPiece(player, '', 1, yTo);
                chessState.castlingDone[player].done = true;
            }
            if(isShotCastle){
                setPiece(player, 'rook', 6, yTo);
                setPiece(player, '', 8, yTo);
                chessState.castlingDone[player].done = true;
            }

            if(transformation !== ''){
                setPiece(player, getLongPieceName(transformation), xTo, yTo);
            }
        }
        if(isPat){
            chessState.winner = 'pat';
            chessState.finished = true;
        }
        else if(isCheckAndMate){
            chessState.winner = player;
            chessState.finished = true;
        }
        setTurnToMove(getOpposite(player));
    }
}

function editGame(){
    try {
        data = JSON.parse(localStorage.getItem('game_' + this.dataset.gameId));
        chessState.positions = getClearPositions();
        toHideHistory = false;
        arrange(data);
        showHistory();

        let pMoves = document.querySelectorAll('.move-number');
        for(let i=0; i<pMoves.length; i++){
            pMoves[i].classList.add('selected-moves');
            pMoves[i].onclick = goToMove;
        }

        function goToMove(event){
            chessState.positions = getClearPositions();
            arrange(data, event.target.dataset.movenumber);
            showHistory();

            let selected = document.querySelector('.move-now');
            if(selected !== null)
                selected.classList.remove('.move-now');

            let movesNumber = document.querySelector('a[data-movenumber="'+event.target.dataset.movenumber +'"]');
            if(movesNumber!== null)
                movesNumber.classList.add('move-now');

            let movesNumberSpan = document.querySelector('span[data-movenumber="'+event.target.dataset.movenumber +'"]');
            if(movesNumberSpan!== null)
                movesNumberSpan.classList.add('move-now');

            let pMoves = document.querySelectorAll('.move-number');
            for(let i=0; i<pMoves.length; i++){
                pMoves[i].classList.add('selected-moves');
                pMoves[i].onclick = goToMove;
            }
        }
    }
    catch (error){
        console.error(error);
    }
}

function checkUpdateGame(){

    let countHistory = chessHistory.length;
    let paramsString = document.location.search;
    let getParams = new URLSearchParams(paramsString);
    let gameId = getParams.get('game');

    if(gameId.length !== 16)
        return;

    fetch('api/api.php?action=loadHistory&gameId=' + gameId)
        .then(response => response.json())
        .then(data => {
            if(data.status === 'success'){
                if(data.history.length > countHistory){

                    drawBoard(showSteps);
                    drawPositionsWithHistory(data, false, true);

                    saveHistory(true);
                    showHistory();
                    updateStatusBar();
                    soundClick();
                }
            }
        });

    timerId = setTimeout(checkUpdateGame, timeOut);
}

function showHistoryList(){

    const url = document.location.pathname + "?do=showHistoryList";
    window.history.replaceState(null, null, url);

    clearContainer();
    stopTimer();

    let chessboard = document.querySelector('#chessboard');
    chessboard.innerHTML = '';

    let divButtons = document.querySelector('#downButtons');
    divButtons.innerHTML = '';

    let leftBoard = document.querySelector('.left-block');
    leftBoard.innerHTML = '';

    let divSelect = document.createElement('div');
    divSelect.classList.add('arrange-board');

    chessState.status = 'loading';

    if(localStorage.hasOwnProperty('games_id')){
        let games = JSON.parse(localStorage.getItem('games_id'));
        try {
            games.sort(gamesSort);
            for(let i=0; i<games.length; i++){

                if(!localStorage.hasOwnProperty('game_' + games[i].id)){
                    continue;
                }
                let gameHistory = JSON.parse(localStorage.getItem('game_' + games[i].id));

                let player;
                if(gameHistory.history.length % 2 === 0)
                    player = 'white';
                else
                    player = 'black';

                let moveNumber = Math.ceil(gameHistory.history.length / 2) + 1;

                let divLoad = document.createElement('div');
                divLoad.classList.add('card-body');

                let spanTime = document.createElement('span');
                spanTime.innerHTML = '<strong>' + (i+1) + '. Date: </strong> ';

                let date = new Date(games[i].time);
                spanTime.innerHTML += date.toDateString() + ' ' + date.toLocaleTimeString() + ' , <strong>' + player +"</strong>'s move. <strong>Move No. </strong>" + moveNumber;

                let imgEdit = document.createElement('img');
                imgEdit.src = 'images/pieces/noOne/pen.png';
                imgEdit.alt = 'pen';

                let linkEdit = document.createElement('a');
                linkEdit.innerText = ' ';
                linkEdit.append(imgEdit);
                linkEdit.innerHTML += 'Edit ';
                linkEdit.href = "#";
                linkEdit.classList.add('me-md-2', 'text-decoration-none');
                linkEdit.onclick = editGame;
                linkEdit.dataset.gameId = games[i].id;

                let imgCopy = document.createElement('img');
                imgCopy.src = 'images/pieces/noOne/copy.png';
                imgCopy.alt = 'copy';

                let linkCopy = document.createElement('a');
                linkCopy.innerText = ' '
                linkCopy.dataset.gameid = games[i].id;
                linkCopy.append(imgCopy);
                linkCopy.innerHTML += 'Copy ';
                linkCopy.href = "#";
                linkCopy.onclick = async function (){
                    try {
                        await navigator.clipboard.writeText(document.location.pathname + '?game=' + games[i].id);
                        console.log('Content copied to clipboard');
                    } catch (err) {
                        console.error('Failed to copy: ', err);
                    }
                }

                let imgContinue = document.createElement('img');
                imgContinue.src = 'images/pieces/noOne/next-track.png';
                imgContinue.alt = 'track';

                let link = document.createElement('a');
                link.append(imgContinue)
                link.href = document.location.pathname + '?game=' + games[i].id;
                link.target = '_blank';
                link.innerHTML +='Continue';
                link.classList.add('me-md-2', 'text-decoration-none');

                let br = document.createElement('br');

                divLoad.append(spanTime, br, link, linkEdit);
                chessboard.append(divLoad);
            }
        }
        catch (error){
            console.error(error);
        }
    }
    else{
        chessboard.innerHTML = '<p class="fs-2">Saved games not found</p>';
    }

    updateStatusBar();
}

function updateStatusBar() {

    let statusBar = document.querySelector('#status-bar');

    if(chessState.status === 'loading')
        statusBar.innerHTML = 'Please, select game';
    else if(chessState.status === 'arrange')
        statusBar.innerHTML = 'Please, select piece and click on the chessboard';
    else if(chessState.finished && chessState.winner !== 'pat')
        statusBar.innerHTML = 'Check and mate! <span class="text-capitalize">' + chessState.winner +'\'s</span> victory!';
    else if (chessState.finished && chessState.winner === 'pat')
        statusBar.innerHTML = 'Draw! Pat!';
    else if (chessState.turnToMove === '') {
        statusBar.innerHTML = "&uarr; For start press <span class=\"text-success\">new game</span> &uarr;";
    } else {
        let statusBarText = `${chessState.turnToMove}'s move`;
        statusBar.innerHTML = statusBarText[0].toUpperCase() + statusBarText.slice(1);
    }

    if(!chessState.finished && !chessState.single){

        let player = getPlayerFromURL();
        let gameId = getGameIDFromURL();

        if(player === '' && gameId.length === 16){

            let linkForWhite = location.origin + location.pathname + "?game=" + gameId + "&player=white";
            let linkForBlack = location.origin + location.pathname + "?game=" + gameId + "&player=black";

            statusBar.innerHTML = "<div id='start-multiplayer' class='form-text'>Game created. Copy link and sent second player. <br>" +
                "Select your player: <br>" +
                "Link for white's: <input type='text' value='" + linkForWhite + "' class='input-start-multiplayer'><a href='" + linkForWhite + "' target='_blank'>Play</a><br> " +
                "Link for black's: <input type='text' value='" + linkForBlack + "' class='input-start-multiplayer'><a href='" + linkForBlack + "' target='_blank'>Play</a><br> " +
                "</div>";
        }
    }
}

function updateStatusSave(status){

    let paramsString = document.location.search;
    let getParams = new URLSearchParams(paramsString);
    if(getParams.has('debug')){
        let pSave = document.querySelector('.status-save');
        pSave.textContent = status;
    }
    else{
        let pSave = document.querySelector('.status-save');
        pSave.textContent = '';
    }
}

function addHistory(player, from, to, chessPiece, check, itsShotCastling, itsLongCastling,
                    isCheckAndMate, isPat, isCapture, enPassant = false, transformation = '', description='', itsLoading=false){

    if(player === 'black' && chessHistory.length === 0){
        addHistory('white', {x:-1, y: -1}, {x:-1, y:-1}, '', false, false)
    }

    let separator = '-';
    if(isCapture)
        separator = 'x';

    let representation;
    if(description === ''){
        if(from.x === -1){
            representation = '...';
        }
        else if (itsShotCastling)
            representation = '0-0';
        else if (itsLongCastling)
            representation = '0-0-0';
        else {
            let abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            let pieceName = getShotPieceName(chessPiece);
            representation = `${pieceName}${abc[from.x-1]}${from.y}${separator}${abc[to.x-1]}${to.y}`;
        }
        if(check)
            representation += '+';

        if(isCheckAndMate)
            representation += '#';

        if(isPat)
            representation += '=';

        if(enPassant)
            representation += ' e.p.';
        representation += transformation;
    }
    else
        representation = description;

    chessHistory.push({
        player: player,
        from: from,
        to: to,
        check: check,
        representation: representation,
        chessPiece: chessPiece,
        enPassant: enPassant
    });

    saveHistory(itsLoading);
}

function getPlayerFromURL(){

    let paramsString = document.location.search;
    let getParams = new URLSearchParams(paramsString);
    if(!getParams.has('player') || (getParams.get('player') !== 'white' && getParams.get('player') !=='black'))
        return '';
    else
        return getParams.get('player');
}

function getGameIDFromURL(){
    let paramsString = document.location.search;
    let getParams = new URLSearchParams(paramsString);
    if(!getParams.has('game'))
        return '';
    else
        return getParams.get('game').slice(0,16);
}

function getLastMove(){

    if(chessHistory.length === 0)
        return undefined;
    return chessHistory[chessHistory.length - 1];

}

function getShotPieceName(piece){
    switch (piece){
        case 'queen':
            return 'Q';
        case 'horse-left':
        case 'horse-right':
            return 'N';
        case 'king':
            return 'K';
        case 'rook':
            return 'R';
        case 'bishop':
            return 'B'
        default:
            return  '';
    }
}

function getLongPieceName(piece){
    switch (piece){
        case 'Q':
            return 'queen';
        case 'N':
            if(Math.random()>0.5)
                return 'horse-left';
            else
                return 'horse-right';
        case 'K':
            return 'king';
        case 'R':
            return 'rook';
        case 'B':
            return 'bishop'
        default:
            return  '';
    }
}

function getRandomString(length){
    let abc = "abcdefghilkmnopqrstuvwxyzABCDEFGHIJKLMNOPRSTUVWXYZ";
    let result = '';
    while (result.length < length) {
        result += abc[Math.floor(Math.random() * abc.length)];
    }
    return result;
}

function getClearPositions(){

    let positions = [...Array(8)].map(() => Array(8).fill({}));

    for(let x = 0; x < sizeX; x++){
        for (let y = 0; y<sizeY; y++){
            positions[x][y] = {
                player: '',
                chessPiece: '',
                x: x + 1,
                y: y + 1
            };
        }
    }

    return positions;
}

function soundClick() {
    let audio = new Audio();
    audio.src = 'sounds/move.mp3';
    audio.play().then();
}

function gamesSort(a, b){
    if (a.time > b.time) return -1;
    else if (a.time === b.time) return 0;
    else return 1;
}