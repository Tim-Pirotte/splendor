init();

function init(){
    document.querySelector("#copy-game-id-button").addEventListener('click', copyGameIdToClipboard)
}

function copyGameIdToClipboard(){
    const $button = document.querySelector("ion-icon");
    navigator.clipboard.writeText(document.querySelector("#game-id").innerText)
    .then( e => {
        setCopyButtonColor($button, "blue")
        setTimeout(setCopyButtonColor, 100, $button, "black")
    })

}

function setCopyButtonColor($button, color){
    console.log(color)
    $button.style.setProperty("color", color);
}