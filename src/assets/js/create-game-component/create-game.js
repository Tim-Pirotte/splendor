import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { locateToMainMenu } from "./helper.js";
import { renderPlayerInfo } from "./renderer.js";

function createInit() {
    setupUI();
}

function setupUI() {
    if (!loadFromStorage("playerName")) locateToMainMenu();
    if (!loadFromStorage("avatar")) locateToMainMenu();
    renderPlayerInfo();
}

createInit();
