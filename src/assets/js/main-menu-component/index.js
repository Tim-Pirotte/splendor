import { renderAvatarSelectionList, renderPlayerInfo } from "./renderer.js";
import { toggleAvatarListVisibility } from "./helper.js";
import { updateSelectedAvatar } from "./handler.js";

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
}

init();
