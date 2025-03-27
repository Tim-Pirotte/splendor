import { loadAvatar, loadUsername, storeAvatar, storeUsername } from "./handler.js";
import { toggleAvatarListVisibility } from "./helper.js";
import { renderSelectableAvatars } from "./renderer.js";

function init() {
    renderSelectableAvatars();
    loadSavedUserInformation();
    addEventListeners();
}

function loadSavedUserInformation() {
    loadUsername();
    loadAvatar();
}

function addEventListeners() {
    document.querySelector(".form-actions").addEventListener("click", storeUsername);
    document.querySelector(".avatar-selector button").addEventListener("click", toggleAvatarListVisibility);
    document.querySelector(".avatar-selector section").addEventListener("click", storeAvatar);
}

init();
