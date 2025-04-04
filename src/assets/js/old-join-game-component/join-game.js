import { navigateToMain, navigateToMainIfNoPlayerName } from "../utils/navigation.js";
import { renderGameList } from "./renderer.js";
import { playerJoinGame, handleFilterChange, playerJoinGameById } from "./handler.js";
import { renderPlayerInformation } from "../utils/player-renderer.js";

function joinInit(){
    navigateToMainIfNoPlayerName();
    renderPlayerInformation();
    renderGameList();

    document.querySelector("#back-button").addEventListener("click", navigateToMain);
    document.querySelector("#join-form").addEventListener("submit", playerJoinGameById);
    document.querySelector("ul").addEventListener("click", playerJoinGame);

    document.querySelector("#amount-filter").addEventListener("change", handleFilterChange);
    document.querySelector("#filter-form").addEventListener("submit", handleFilterChange);
}

joinInit();
