import { checkCompatibility } from "../server-version-component/server-version.js";
import { soundInit } from "../sound-component/sound.js";
import { closeAvatarVisibility, savePlayerInfo, saveUserName, updateSelectedAvatar } from "./handler.js";
import { hideDemoButton, renderAvatarSelectionList, renderAuthors, renderCorrectErrorMessage, renderPlayerInfo } from "./renderer.js";

function init() {
    setupUI();
    setupEventListeners();
    renderAuthors();

    soundInit();
}

function setupUI() {
    checkCompatibility(2)
        .then(compatible => {
            renderAvatarSelectionList();
            renderPlayerInfo();
            hideDemoButton(compatible);
            renderCorrectErrorMessage();
        });
}

function setupEventListeners() {
    document.addEventListener("click", closeAvatarVisibility);
    document.querySelector(".avatar-selector section").addEventListener("click", updateSelectedAvatar);
    document.querySelectorAll("form .form-actions button")
        .forEach($button => $button.addEventListener("click", savePlayerInfo));
    document.querySelector("#username").addEventListener("change", saveUserName);
}

init();
