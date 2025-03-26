import {processTakeTokenClick, selectToken} from "./token-handler.js";

function tokenInit(){
    document.querySelector(".board-tokens").addEventListener("click", selectToken);
    document.querySelector(".action-button").addEventListener("click", processTakeTokenClick);
}

export {tokenInit};