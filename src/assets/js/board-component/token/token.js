import { selectToken } from "./token-handler.js";
import {selectPlayerToken} from "./discard.js";

function tokenInit(){
    document.querySelector(".board-tokens").addEventListener("click", selectToken);
    document.querySelector(".player-tokens ul").addEventListener("click", selectPlayerToken);
}

export { tokenInit };
