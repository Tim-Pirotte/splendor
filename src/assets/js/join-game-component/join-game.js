import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { renderPlayerInfo } from "./renderer.js";

function joinInit() {
    setupUI();
}

function setupUI() {
    if (!loadFromStorage("playerName")) location.href = `./../index.html`;
    if (!loadFromStorage("avatar")) location.href = `./../index.html`;
    renderPlayerInfo();
}

joinInit();
