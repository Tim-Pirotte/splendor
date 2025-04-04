import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { createGameUsingGui, locateToMainMenu } from "./handler.js";
import { renderPlayerInfo } from "./renderer.js";


function createInit() {
    setupUI();
    setupEventListeners();
}

function setupUI() {
    if (!loadFromStorage("playerName")) locateToMainMenu();
    if (!loadFromStorage("avatar")) locateToMainMenu();
    renderPlayerInfo();
}

function setupEventListeners() {
    document.querySelector("#back-button").addEventListener("click", locateToMainMenu);
    document.querySelector("form").addEventListener("submit", createGameUsingGui);
}

createInit();
