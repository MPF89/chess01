//Объявляем переменные состояния:
const chessState = {
    positions: [],
    turnToMove: 'white',
    selected: {
        x: -1,
        y: -1,
        chessPiece: '',
    },
    castlingDone:{
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
    },
    winner: '',
    finished: false,
    initialLocation: ''
}

let chessHistory = [];
let toHideHistory = false;

const sizeX = 8;
const sizeY = 8;
drawBoard(showSteps);

document.querySelector("#button-start").addEventListener("click", showNewGameOptions);
document.querySelector('#button-arrange').addEventListener('click', arrange)

document.querySelector('#button-hide').onclick = function(){

    toHideHistory = !toHideHistory;

    let history = document.querySelector('#history');
    if(toHideHistory){
        this.textContent = 'show';
        history.style.visibility = "hidden";
    }
    else{
        this.textContent = 'hide';
        history.style.visibility = "visible";
        showHistory();
    }
}

loadGame();