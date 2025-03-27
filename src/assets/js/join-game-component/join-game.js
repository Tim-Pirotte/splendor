import {renderList} from "./renderer.js";
import {playerJoinGame, handleFilterChange} from "./handler.js";
import {navigateToMain} from "../general-logic/join-create-game.js";

function init(){
    
    renderList();

    document.querySelector("#back-button").addEventListener("click", navigateToMain);
    document.querySelector("ul").addEventListener("click", playerJoinGame);

    document.querySelector("#amount-filter").addEventListener("change", handleFilterChange);
    document.querySelector("#filter-form").addEventListener("submit", handleFilterChange);
}

init();
