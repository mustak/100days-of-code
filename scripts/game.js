function startNewGame() {
    if (validPlayerNames()) {
        showGameBoard();
    } else {
        statusMessage.textContent = 'Enter player names.';
    }
}

function showGameBoard() {
    canvasBoardGame.style.display = 'block';
}

function validPlayerNames() {
    return players.every((player) => player.name);
}
