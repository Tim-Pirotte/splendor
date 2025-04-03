import { renderAvatarSelectionList, renderPlayerInfo } from "./renderer.js";
import { toggleAvatarListVisibility } from "./helper.js";

function init() {
    setupUI();
    setupEventListeners();
}

function setupUI() {
    renderAvatarSelectionList();
    renderPlayerInfo();
}

function setupEventListeners() {
    document.querySelector(".avatar-selector button").addEventListener("click", toggleAvatarListVisibility);
}

init();
