init();

function init(){
    document.querySelector("#copy-game-id-button").addEventListener('click', copyGameIdToClipboard)
}

function copyGameIdToClipboard(){
    navigator.clipboard.writeText(document.querySelector("#game-id").innerText);
}