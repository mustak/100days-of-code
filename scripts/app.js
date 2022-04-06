let playerID;
let activePlayer = 0;
const players = [
    {
        name: '',
        symbol: 'X',
    },
    {
        name: '',
        symbol: 'O',
    },
];

const gameData = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

//UI elements
const backdrop = document.getElementById('backdrop');
const modal = document.getElementById('configuration-overlay');

const btnPlayer1Edit = document.getElementById('btn-edit-player1');
const btnPlayer2Edit = document.getElementById('btn-edit-player2');

const inputPlayerName = document.getElementById('playername');
const btnCancel = document.getElementById('configCancel');
const btnConfirm = document.getElementById('configConfirm');

const btnStartGame = document.getElementById('btn-start-game');
const canvasBoardGame = document.getElementById('active-game');
const gameboard = document.getElementById('game-board');
const statusMessage = document.getElementById('status');
const activePlayerName = document.getElementById('active-player-name');

// Events
btnPlayer1Edit.addEventListener('click', openPlayerConfig);
btnPlayer2Edit.addEventListener('click', openPlayerConfig);

btnCancel.addEventListener('click', handleCancel);
btnConfirm.addEventListener('click', handleConfirm);

backdrop.addEventListener('click', handleCancel);

btnStartGame.addEventListener('click', handleStartNewGame);
gameboard.addEventListener('click', handleUserSelection);

// Status message functions
let timeOutFunction;
const TimeOutDuration = 5000;
function showStatusMessage(message) {
    statusMessage.textContent = message;

    timeOutFunction = setTimeout(clearStatusMessgae, TimeOutDuration);
}
function clearStatusMessgae() {
    statusMessage.textContent = '';
    clearTimeout(timeOutFunction);
}
