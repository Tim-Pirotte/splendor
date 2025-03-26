import {renderList} from "./renderer.js";
import {playerJoinGame} from "./handler.js";

function init(){
    renderList();

    document.querySelector("ul").addEventListener("click", playerJoinGame);
}

init();
