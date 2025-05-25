import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { createGame } from "./handler.js";
import { renderPlayerInfo, removeVisibilitySelector } from "./renderer.js";
import { locateToMainMenu } from "../utils/data-handler.js";
import { checkCompatibility } from "../server-version-component/server-version.js";
import { renderDefaultGameNamePlaceholder } from "../utils/renderer.js";
import { effects } from "../sound-component/sound.js";

function createInit() {
    setupUI();
    setupEventListeners();
    setupSound();
}

function setupUI() {
    if (!loadFromStorage("playerName")) locateToMainMenu();
    if (!loadFromStorage("avatar")) locateToMainMenu();
    renderPlayerInfo();
    renderDefaultGameNamePlaceholder(document.querySelector("#game-name"));
    checkCompatibility(2)
        .then(isCompatible => {if (!isCompatible) removeVisibilitySelector();});
}

function setupEventListeners() {
    document.querySelector("form").addEventListener("submit", createGame);
}

function setupSound(){
    document.querySelectorAll("button[type=submit], input[type=radio]")
        .forEach(node => node.addEventListener("click", effects.playClick));
}

createInit();
