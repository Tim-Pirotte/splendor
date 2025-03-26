import {loadAvatar, loadUsername, storeAvatar, storeUsername, toggleVisibility} from "./handler.js";
import {renderSelectableAvatars} from "./renderer.js";

function init() {
    renderSelectableAvatars();
    loadUserInformation();

    document.querySelector(".form-actions").addEventListener("click", storeUserInformation);
    document.querySelector("section").addEventListener("click", storeAvatar);
    document.querySelector(".avatar-selector button").addEventListener("click", toggleVisibility);
}

function loadUserInformation() {
    loadUsername();
    loadAvatar();
}

function storeUserInformation(e) {
    storeUsername(e);
    storeAvatar(e);
}

init();
