import { soundInit } from "../sound-component/sound.js";
import { closeAvatarVisibility, savePlayerInfo, updateSelectedAvatar } from "./handler.js";
import { renderAuthors, renderAvatarSelectionList, renderPlayerInfo } from "./renderer.js";

function init() {
    setupUI();
    setupEventListeners();
    renderAuthors();

    soundInit();
}

function setupUI() {
    renderAvatarSelectionList();
    renderPlayerInfo();
}

function setupEventListeners() {
    document.addEventListener("click", closeAvatarVisibility);
    document.querySelector(".avatar-selector section").addEventListener("click", updateSelectedAvatar);
    document.querySelectorAll("form .form-actions button")
        .forEach($button => $button.addEventListener("click", savePlayerInfo) );
}

init();
