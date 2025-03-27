import { loadAvatar, loadUsername, storeAvatar, storeUsername, toggleVisibility } from "./handler.js";
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
    document.querySelector(".avatar-selector button").addEventListener("click", toggleVisibility);
    document.querySelector(".avatar-selector section").addEventListener("click", storeAvatar);
}

init();
