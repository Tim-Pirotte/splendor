import { loadLobbyInformation, copyGameId } from "./handler.js";

function lobbyInit () {
    loadLobbyInformation();
    document.querySelector("#copy-game-id-button").addEventListener("click", copyGameId);
}

lobbyInit ();
