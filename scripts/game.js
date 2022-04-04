function handleStartNewGame() {
    if (validPlayerNames()) {
        showGameBoard();
    } else {
        showStatusMessage('Enter valid player names.');
    }
    // showGameBoard();
}

function handleUserSelection(event) {
    const clickedElement = event.target;
    const elmClicked = clickedElement.nodeName;
    console.dir(clickedElement.classList);
    if (elmClicked === 'LI' && !clickedElement.classList.contains('disabled')) {
        clickedElement.textContent = players[activePlayer].symbol;
        clickedElement.classList.add('disabled');
        swapPlayer();
    }
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
