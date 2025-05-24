import { loadLobbyInformation, copySharingLink, processAddBot } from "./handler.js";
import { soundInit } from "../sound-component/sound.js";
import * as API from "../api.js";

function lobbyInit () {
    loadLobbyInformation(true);
    document.querySelector("#share-link").addEventListener("click", copySharingLink);
    document.querySelector(".leave-button").addEventListener("click", API.leaveGame);
    document.querySelector("#joined-players").addEventListener("click", processAddBot);

    soundInit();
}

lobbyInit ();
