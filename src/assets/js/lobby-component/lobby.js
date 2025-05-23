import { loadLobbyInformation, copyGameId, processAddBot } from "./handler.js";
import { playEffect, soundInit } from "../sound-component/sound.js";
import * as API from "../api.js";

function lobbyInit () {
    loadLobbyInformation(true);
    loadSound();
    document.querySelector("#copy-game-id-button").addEventListener("click", copyGameId);
    document.querySelector(".leave-button").addEventListener("click", API.leaveGame);
    document.querySelector("#joined-players").addEventListener("click", processAddBot);
}

function loadSound () {
    soundInit();
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {playEffect("button-press", false);});
    });
}

lobbyInit ();
