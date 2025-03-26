import {decreaseTokenValue, selectToken} from "./token-handler.js";

function init(){
    document.querySelector(".board-tokens").addEventListener("click", selectToken);
    document.querySelector(".action-button").addEventListener("click", decreaseTokenValue);
}

export {init};