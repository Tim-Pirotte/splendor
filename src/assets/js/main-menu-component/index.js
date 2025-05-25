import { checkCompatibility } from "../server-version-component/server-version.js";
import "../sound-component/sound.js";
import { closeAvatarVisibility, savePlayerInfo, saveUserName, updateSelectedAvatar } from "./handler.js";
import {
    hideDemoButton,
    renderAuthors,
    renderAvatarSelectionList,
    renderCorrectErrorMessage,
    renderPlayerInfo,
} from "./renderer.js";
import { effects } from "../sound-component/sound.js";

function init() {
    setupUI();
    setupEventListeners();
    renderAuthors();
    setupSound();
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

function setupSound() {
    document.querySelectorAll(".form-actions button, a, #avatar, .avatar-selector section")
        .forEach(button => button.addEventListener("click", effects.playClick));
}

function setupEventListeners() {
    document.addEventListener("click", closeAvatarVisibility);
    document.querySelector(".avatar-selector section").addEventListener("click", updateSelectedAvatar);
    document.querySelectorAll("form .form-actions button")
        .forEach($button => $button.addEventListener("click", savePlayerInfo));
    document.querySelector("#username").addEventListener("change", saveUserName);
}

init();
