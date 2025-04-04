import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { createGame, locateMainMenu } from "./handler.js";
import { renderPlayerInfo } from "./renderer.js";

function createInit() {
    setupUI();
    setupEventListeners();
}

function setupUI() {
    if (!loadFromStorage("playerName")) locateMainMenu();
    if (!loadFromStorage("avatar")) locateMainMenu();
    renderPlayerInfo();
}

function setupEventListeners() {
    document.querySelector("#back-button").addEventListener("click", locateMainMenu);
    document.querySelector("form").addEventListener("submit", createGame);
}

createInit();
