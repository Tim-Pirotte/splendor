import { checkCompatibility } from "../server-version-component/server-version.js";
import "../sound-component/sound.js";
import { closeAvatarVisibility, savePlayerInfo, updateSelectedAvatar } from "./handler.js";
import { hideDemoButton, renderAvatarSelectionList, renderPlayerInfo } from "./renderer.js";

function init() {
    setupUI();
    setupEventListeners();

    //soundInit();
}

function setupUI() {
    checkCompatibility(2)
        .then(compatible => {
            renderAvatarSelectionList();
            renderPlayerInfo();
            hideDemoButton(compatible);
        });
}

function setupEventListeners() {
    document.addEventListener("click", closeAvatarVisibility);
    document.querySelector(".avatar-selector section").addEventListener("click", updateSelectedAvatar);
    document.querySelectorAll("form .form-actions button")
        .forEach($button => $button.addEventListener("click", savePlayerInfo) );
}

init();
