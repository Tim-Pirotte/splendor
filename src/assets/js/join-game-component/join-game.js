import { navigateToMain } from "../utils/navigation.js";
import { renderList } from "./renderer.js";
import { playerJoinGame, handleFilterChange, playerJoinGameById } from "./handler.js";
import { renderPlayerInformation } from "../utils/player-renderer.js";

function init(){
    renderPlayerInformation();
    renderList();

    document.querySelector("#back-button").addEventListener("click", navigateToMain);
    document.querySelector("#join-form").addEventListener("submit", playerJoinGameById);
    document.querySelector("ul").addEventListener("click", playerJoinGame);

    document.querySelector("#amount-filter").addEventListener("change", handleFilterChange);
    document.querySelector("#filter-form").addEventListener("submit", handleFilterChange);
}

init();
