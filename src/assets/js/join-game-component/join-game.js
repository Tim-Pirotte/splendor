import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import {joinGame, joinGameByIdParameter, joinGameUsingUsersInputId} from "./handler.js";
import { locateToMainMenu } from "../utils/data-handler.js";
import { renderPlayerInfo, initGameRendering } from "./renderer.js";
import { renderDefaultGameNamePlaceholder } from "../utils/renderer.js";
import { soundInit } from "../sound-component/sound.js";

function joinInit() {
    const gameIdParameter = new URL(window.location.href).searchParams.get("gameId");

    if (gameIdParameter) {
        joinGameByIdParameter(gameIdParameter);
    } else {
        setupUI();
        setupEventListeners();
        soundInit();
    }
}

function setupUI() {
    if (!loadFromStorage("playerName") || !loadFromStorage("avatar")) {locateToMainMenu(); return;}
    renderPlayerInfo();
    renderDefaultGameNamePlaceholder(document.querySelector("#game-name"));
    initGameRendering();
}

function setupEventListeners() {
    document.querySelector("#join-form").addEventListener("submit", joinGameUsingUsersInputId);
    document.querySelector("ul").addEventListener("click", joinGame);
    document.querySelector("#filter-form").addEventListener("input", initGameRendering);
    document.querySelector("#filter-form").addEventListener("submit", initGameRendering);
    document.querySelector("#filter-form input[type='reset']").addEventListener("click", initGameRendering);
}

joinInit();
