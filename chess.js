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
    }
}

const sizeX = 8;
const sizeY = 8;
drawBoard();
document.querySelector("#button-start").addEventListener("click", showNewGameOptions);

