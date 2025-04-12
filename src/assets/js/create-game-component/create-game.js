import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { createGame } from "./handler.js";
import {renderPlayerInfo, removeVisibilitySelector} from "./renderer.js";
import { locateToMainMenu } from "../utils/data-handler.js";
import {checkCompatibility} from "../server-version-component/server-version.js";

function createInit() {
    setupUI();
    setupEventListeners();
}

function setupUI() {
    if (!loadFromStorage("playerName")) locateToMainMenu();
    if (!loadFromStorage("avatar")) locateToMainMenu();
    checkCompatibility(2).then(isCompatible => {
        renderPlayerInfo();

        if (!isCompatible) removeVisibilitySelector();

    })


}

function setupEventListeners() {
    document.querySelector("#back-button").addEventListener("click", locateToMainMenu);
    document.querySelector("form").addEventListener("submit", createGame);
}

createInit();
