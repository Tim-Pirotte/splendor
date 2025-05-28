import { loadLobbyInformation, copySharingLink, processAddBot } from "./handler.js";
import { effects } from "../sound-component/sound.js";
import * as API from "../api.js";
import {initController} from "../controller-component/controller.js";

function lobbyInit () {
    loadLobbyInformation(true);
    setupSound();
    document.querySelector("#share-link").addEventListener("click", copySharingLink);
    document.querySelector(".leave-button").addEventListener("click", API.leaveGame);
    document.querySelector("#joined-players").addEventListener("click", processAddBot);
    initController();
}

function setupSound() {
    document.querySelectorAll(".leave-button, #share-link, #joined-players")
        .forEach(button => {
            button.addEventListener("click", effects.playClick);
        });
}

lobbyInit ();
