import { copyGameId, loadLobbyInformation, processAddBot } from "./handler.js";
import { effects, soundInit } from "../sound-component/sound.js";
import * as API from "../api.js";

function lobbyInit() {
    loadLobbyInformation(true);
    loadSound();
    document.querySelector("#copy-game-id-button").addEventListener("click", copyGameId);
    document.querySelector(".leave-button").addEventListener("click", API.leaveGame);
    document.querySelector("#joined-players").addEventListener("click", processAddBot);
}

function loadSound() {
    soundInit();
    document.querySelectorAll(".leave-button, #copy-game-id-button, #joined-players")
        .forEach(button => {
            button.addEventListener("click", effects.playClick);
        });
}

lobbyInit();
