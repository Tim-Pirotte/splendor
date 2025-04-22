import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { joinGame, joinGameUsingUsersInputId, locateMainMenu } from "./handler.js";
import {renderFilteredGames, renderPlayerInfo, renderPublicGames} from "./renderer.js";

function joinInit() {
    setupUI();
    setupEventListeners();
}

function setupUI() {
    if (!loadFromStorage("playerName") || !loadFromStorage("avatar")) {locateMainMenu(); return;}
    renderPlayerInfo();
    renderPublicGames();
}

function setupEventListeners() {
    document.querySelector("#back-button").addEventListener("click", locateMainMenu);
    document.querySelector("#join-form").addEventListener("submit", joinGameUsingUsersInputId);
    document.querySelector("ul").addEventListener("click", joinGame);
    document.querySelector("#filter-form").addEventListener("change", renderFilteredGames);
    document.querySelector("#filter-form").addEventListener("submit", renderFilteredGames);
    document.querySelector("#filter-form input[type='reset']").addEventListener("click", renderPublicGames)
}

joinInit();
