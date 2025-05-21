import { loadLobbyInformation, copyGameId, processAddBot } from "./handler.js";
import * as API from "../api.js";

function lobbyInit () {
    loadLobbyInformation(true);
    document.querySelector("#copy-game-id-button").addEventListener("click", copyGameId);
    document.querySelector(".leave-button").addEventListener("click", API.leaveGame);
    document.querySelector("#joined-players").addEventListener("click", processAddBot);
}

lobbyInit ();
