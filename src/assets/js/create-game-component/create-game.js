import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { createGame } from "./handler.js";
import { renderPlayerInfo } from "./renderer.js";
import {locateToMainMenu} from "../utils/data-handler.js";

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
    document.querySelector("form").addEventListener("submit", createGame);
}

createInit();
