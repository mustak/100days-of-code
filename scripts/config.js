function openPlayerConfig(event) {
    // playerID = event.target.id;
    playerID = +event.target.dataset.playerid;

    backdrop.style.display = 'block';
    modal.style.display = 'block';

    inputPlayerName.value = getH3Playername(playerID);
    inputPlayerName.focus();
    inputPlayerName.select();
}

function handleCancel() {
    inputPlayerName.classList.remove('error');
    inputPlayerName.value = '';
    backdrop.style.display = 'none';
    modal.style.display = 'none';
}

function handleConfirm(e) {
    e.preventDefault();
    const playername = inputPlayerName.value.trim();

    if (!playername) {
        inputPlayerName.classList.add('error');
        return;
    }

    setH3Playername(playerID, playername);
    players[playerID - 1].name = playername;
    handleCancel();
}

function getH3Playername(playerID) {
    return document.querySelector(`#player${playerID}-details h3`).textContent;
}

function setH3Playername(playerID, name) {
    document.querySelector(`#player${playerID}-details h3`).textContent = name;
}
