import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { joinGame, joinGameUsingId, locateMainMenu } from "./handler.js";
import { renderPlayerInfo, renderPublicGames } from "./renderer.js";

function joinInit() {
    setupUI();
    setupEventListeners();
}

function setupUI() {
    if (!loadFromStorage("playerName")) locateMainMenu();
    if (!loadFromStorage("avatar")) locateMainMenu();
    renderPlayerInfo();
    renderPublicGames();
}

function setupEventListeners() {
    document.querySelector("#back-button").addEventListener("click", locateMainMenu);
    document.querySelector("#join-form").addEventListener("submit", joinGameUsingId);
    document.querySelector("ul").addEventListener("click", joinGame);
}

joinInit();
