import { loadLobbyInformation, copyGameId } from "./handler.js";
import * as API from "../api.js";

function lobbyInit () {
    loadLobbyInformation();
    document.querySelector("#copy-game-id-button").addEventListener("click", copyGameId);
    document.querySelector(".leave-button").addEventListener("click", API.leaveGame)
}

lobbyInit ();
