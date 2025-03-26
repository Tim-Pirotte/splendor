import * as token from"./token-handler.js"
function init(){
    document.querySelector(".board-tokens").addEventListener("click",token.selectToken)
    document.querySelector(".action-button").addEventListener("click",token.decreaseTokenValue)
}

export {init}