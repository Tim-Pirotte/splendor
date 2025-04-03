import { renderAvatarSelectionList, renderPlayerInfo } from "./renderer.js";
import { savePlayerInfo, updateSelectedAvatar } from "./handler.js";
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
    document.querySelector(".avatar-selector section").addEventListener("click", updateSelectedAvatar);
    document.querySelector("form").addEventListener("click", savePlayerInfo);
}

init();
