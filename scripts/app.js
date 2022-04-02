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

const backdrop = document.getElementById('backdrop');
const modal = document.getElementById('configuration-overlay');

const btnPlayer1Edit = document.getElementById('btn-edit-player1');
const btnPlayer2Edit = document.getElementById('btn-edit-player2');

const inputPlayerName = document.getElementById('playername');
const btnCancel = document.getElementById('configCancel');
const btnConfirm = document.getElementById('configConfirm');

btnPlayer1Edit.addEventListener('click', openPlayerConfig);
btnPlayer2Edit.addEventListener('click', openPlayerConfig);

btnCancel.addEventListener('click', handleCancel);
btnConfirm.addEventListener('click', handleConfirm);

backdrop.addEventListener('click', handleCancel);
