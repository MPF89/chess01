function drawBoard(functionClick){

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

    hideSelectPawnMenu();
    startGame('white', 'iniStandard');
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
        drawBoard(showSteps);
        iniStandard();
    });

    let newButtonRemote = document.createElement('button');
    newButtonRemote.textContent = "REMOTE GAME";
    newButtonRemote.classList.add('col-4', 'rounded');
    newButtonRemote.addEventListener('click', ()=>{
        drawBoard(showSteps);
        iniStandard();
    });

    divButton.append(spanH1);
    divButton.append(newButtonThisPC);
    divButton.append(spanLabelThisPC);
    divButton.append(newButtonRemote);

    chessboard.append(divButton);

    chessHistory = [];
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

function updateStatusBar() {

    let statusBar = document.querySelector('#status-bar');
    if(chessState.status === 'arrange')
        statusBar.innerHTML = 'Please, select piece and click on the chessboard';
    else if(chessState.finished && chessState.winner !== 'pat')
        statusBar.innerHTML = 'Check and mate! <span class="text-capitalize">' + chessState.winner +'</span> wins!';
    else if (chessState.finished && chessState.winner === 'pat')
        statusBar.innerHTML = 'Draw! Pat!';
    else if (chessState.turnToMove === '') {
        statusBar.innerHTML = "&uarr; For start press <span class=\"text-success\">new game</span> &uarr;";
    } else {
        let statusBarText = `${chessState.turnToMove}'s move`;
        statusBar.innerHTML = statusBarText[0].toUpperCase() + statusBarText.slice(1);
    }
}

function addHistory(player, from, to, chessPiece, check, itsShotCastling, itsLongCastling,
                    isCheckAndMate, isPat, isCapture, enPassant = false, transformation = '') {

    if(player === 'black' && chessHistory.length === 0){
        addHistory('white', {x:-1, y: -1}, {x:-1, y:-1}, '', false, false)
    }

    let separator = '-';
    if(isCapture)
        separator = 'x';

    let representation;
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

        chessHistory.push({
        player: player,
        from: from,
        to: to,
        check: check,
        representation: representation,
        chessPiece: chessPiece,
        enPassant: enPassant
    });

    saveHistory();
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
            blackStep = chessHistory[i].representation + '';
        else if (chessHistory[i].player === 'white')
            whiteStep = chessHistory[i].representation + ' ';
    }
    innerHTML += whiteStep + blackStep + '</p>';
    history.innerHTML = innerHTML;
}

function getRandomString(length){
    let abc = "abcdefghilkmnopqrstuvwxyzABCDEFGHIJKLMNOPRSTUVWXYZ";
    let result = '';
    while (result.length < length) {
        result += abc[Math.floor(Math.random() * abc.length)];
    }
    return result;
}

function createGameHistory(initialLocation){

    let guid = getRandomString(16);
    const url = document.location.pathname + "?game=" + guid;
    window.history.replaceState(null, null, url);

    chessState.initialLocation = initialLocation;

}

function saveHistory(){

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
            startPosition: startPositions,
            history: shotHistory
        }));
    }
}

function soundClick() {
    let audio = new Audio();
    audio.src = 'sounds/move.mp3';
    audio.play().then();
}

function getOpposite(player){

    if(player === 'white')
        return 'black';
    else if (player === 'black')
        return  'white';
    else
        return '';
}

function arrange(){

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
        ['white', 'bishop'],
        ['white', 'horse-left'],
        ['white', 'king'],
        ['white', 'pawn'],
        ['white', 'queen'],
        ['white', 'rook'],

        ['black', 'bishop'],
        ['black', 'horse-left'],
        ['black', 'king'],
        ['black', 'pawn'],
        ['black', 'queen'],
        ['black', 'rook'],

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

    let optionBlacks = document.createElement('option');
    optionBlacks.dataset.player = 'black';
    optionBlacks.textContent = "Black's move";

    elSelect.append(optionWhites);
    elSelect.append(optionBlacks);
    elSelect.classList.add('form-select-sm', 'form-check-inline');
    divButtons.append(elSelect);

    let startButton = document.createElement('button');
    startButton.innerText = 'Start';
    startButton.onclick = startArranges;
    startButton.classList.add('btn-success');
    divButtons.append(startButton);

    toHideHistory = true;
    updateStatusBar();
    drawBoard(arrangeBoardSelect);
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

    let divButtons = document.querySelector('#downButtons');
    divButtons.innerHTML = '';

    hideSelectPawnMenu();
    startGame(selected.dataset.player, JSON.stringify(chessState.positions));
}

function startGame(player, startPositions){
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

    setTurnToMove(player);
    updateStatusBar();
    showHistory();
    createGameHistory(startPositions);
}