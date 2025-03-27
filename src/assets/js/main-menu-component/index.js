import { loadAvatar, loadUsername, storeAvatar, storeUsername, toggleVisibility } from "./handler.js";
import { renderSelectableAvatars } from "./renderer.js";

function init() {
    renderSelectableAvatars();
    loadSavedUserInformation();

    document.querySelector(".form-actions").addEventListener("click", storeUsername);
    document.querySelector(".avatar-selector button").addEventListener("click", toggleVisibility);
    document.querySelector(".avatar-selector section").addEventListener("click", storeAvatar);
}

function loadSavedUserInformation() {
    loadUsername();
    loadAvatar();
}

init();
