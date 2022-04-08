function handleStartNewGame() {
    // if (!validPlayerNames) {
    //     showStatusMessage('Enter valid player names.');
    //     return;
    // }
    showGameBoard();
    showActivePlayerName();
}

function handleUserSelection(event) {
    const clickedElement = event.target;
    const elmClicked = clickedElement.nodeName;

    if (elmClicked !== 'LI' || clickedElement.classList.contains('disabled')) {
        showStatusMessage('Select an empty box.');
        return;
    }

    const row = clickedElement.dataset.row;
    const col = clickedElement.dataset.col;
    gameData[row][col] = activePlayer + 1;

    clickedElement.textContent = players[activePlayer].symbol;
    clickedElement.classList.add('disabled');

    console.log(checkGameOver());
    const winnerID = checkGameOver();

    roundCount++;
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
function checkGameOver() {
    //check rows
    for (let i = 0; i < gameData.length; i++) {
        if (
            gameData[i][0] > 0 &&
            gameData[i][0] === gameData[i][1] &&
            gameData[i][0] === gameData[i][2]
        ) {
            return gameData[i][0];
        }
    }

    //check columns
    for (let i = 0; i < 3; i++) {
        if (
            gameData[0][i] > 0 &&
            gameData[0][i] === gameData[1][i] &&
            gameData[0][i] === gameData[2][i]
        ) {
            return gameData[0][i];
        }
    }

    //check diagonal tl>br
    if (
        gameData[0][0] > 0 &&
        gameData[0][0] === gameData[1][1] &&
        gameData[0][0] === gameData[2][2]
    ) {
        return gameData[0][0];
    }

    //check diagonal tr>bl
    if (
        gameData[0][2] > 0 &&
        gameData[0][2] === gameData[1][1] &&
        gameData[0][2] === gameData[2][0]
    ) {
        return gameData[0][2];
    }

    if (roundCount === 9) {
        return -1;
    }

    return 0;
}
