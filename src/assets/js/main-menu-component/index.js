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
    document.querySelectorAll("form .form-actions button")
        .forEach($button => $button.addEventListener("click", savePlayerInfo) );
}

init();
