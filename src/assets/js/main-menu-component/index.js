import { savePlayerInfo, toggleAvatarListVisibility, updateSelectedAvatar } from "./handler.js";
import { renderAvatarSelectionList, renderPlayerInfo } from "./renderer.js";

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
    document.querySelector(".avatar-selector section").addEventListener("click", updateSelectedAvatar);
    document.querySelector("form").addEventListener("submit", savePlayerInfo);
}

init();
