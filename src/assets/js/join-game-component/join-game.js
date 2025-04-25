import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { joinGame, joinGameUsingUsersInputId } from "./handler.js";
import { renderPlayerInfo, renderPublicGames } from "./renderer.js";
import { locateToMainMenu } from "../utils/data-handler.js";
import { renderDefaultGameNamePlaceholder } from "../utils/renderer.js";

function joinInit() {
    setupUI();
    setupEventListeners();
}

function setupUI() {
    if (!loadFromStorage("playerName") || !loadFromStorage("avatar")) {locateToMainMenu(); return;}
    renderPlayerInfo();
    renderDefaultGameNamePlaceholder(document.querySelector("#game-name"));
    renderPublicGames();
}

function setupEventListeners() {
    document.querySelector("#join-form").addEventListener("submit", joinGameUsingUsersInputId);
    document.querySelector("ul").addEventListener("click", joinGame);
    document.querySelector("#filter-form").addEventListener("change", renderPublicGames);
    document.querySelector("#filter-form").addEventListener("submit", renderPublicGames);
    document.querySelector("#filter-form input[type='reset']").addEventListener("click", renderPublicGames);
}

joinInit();
