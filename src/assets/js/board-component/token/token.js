import {processTakeTokenClick, selectToken} from "./token-handler.js";

function tokenInit(){
    document.querySelector(".board-tokens").addEventListener("click", selectToken);
}

export {tokenInit};