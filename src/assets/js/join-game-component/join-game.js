import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { joinGameUsingGui, joinGameUsingId, locateToMainMenu } from "./handler.js";
import { renderPlayerInfo, renderPublicGames } from "./renderer.js";

function joinInit() {
    setupUI();
    setupEventListeners();
}

function setupUI() {
    if (!loadFromStorage("playerName")) locateToMainMenu();
    if (!loadFromStorage("avatar")) locateToMainMenu();
    renderPlayerInfo();
    renderPublicGames();
}

function setupEventListeners() {
    document.querySelector("#back-button").addEventListener("click", locateToMainMenu);
    document.querySelector("#join-form").addEventListener("submit", joinGameUsingId);
    document.querySelector("ul").addEventListener("click", joinGameUsingGui);
}

joinInit();
