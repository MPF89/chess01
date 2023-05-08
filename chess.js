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
    single: true,
    finished: false,
    initialLocation: ''
}
const historyLimit = 50;

let chessHistory = [];
let toHideHistory = false;
let timerId = null;
let timeOut = 3000;

const sizeX = 8;
const sizeY = 8;
drawBoard(showSteps);

document.querySelector("#button-start").addEventListener("click", showNewGameOptions);
document.querySelector('#button-arrange').addEventListener('click', arrange);
document.querySelector('#button-load').addEventListener('click', showHistoryList);

document.querySelector('#button-hide').onclick = hideShowHistory;

loadGame().then(() => {}) //загрузка игры из БД;