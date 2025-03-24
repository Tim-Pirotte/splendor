init();

function init(){
    document.querySelector("#copy-game-id-button").addEventListener('click', copyGameIdToClipboard)
}

function copyGameIdToClipboard(){
    const gameId = document.querySelector("#game-id").innerText;
    navigator.clipboard.writeText(gameId);
}