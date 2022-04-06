function handleStartNewGame() {
    if (!validPlayerNames) {
        showStatusMessage('Enter valid player names.');
        return;
    }
    showGameBoard();
    showActivePlayerName();
}

function handleUserSelection(event) {
    const clickedElement = event.target;
    const elmClicked = clickedElement.nodeName;

    const row = clickedElement.dataset.row;
    const col = clickedElement.dataset.col;

    if (elmClicked !== 'LI' || clickedElement.classList.contains('disabled')) {
        showStatusMessage('Select an empty box.');
        return;
    }

    gameData[row][col] = activePlayer + 1;
    console.log(gameData);
    clickedElement.textContent = players[activePlayer].symbol;
    clickedElement.classList.add('disabled');
    swapPlayer();
    showActivePlayerName();
}

function showGameBoard() {
    canvasBoardGame.style.display = 'block';
}

function validPlayerNames() {
    return players.every((player) => player.name);
}

function swapPlayer() {
    if (activePlayer === 0) {
        activePlayer = 1;
    } else {
        activePlayer = 0;
    }
}

function showActivePlayerName() {
    activePlayerName.textContent = players[activePlayer].name;
}
