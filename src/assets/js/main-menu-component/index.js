import {loadAvatar, loadUsername, storeAvatar, storeUsername} from "./helper.js";
import {renderSelectableAvatars} from "./renderer.js";

function init() {
    renderSelectableAvatars();
    loadUserInformation();
    document.querySelector(".form-actions").addEventListener("click", storeUsername);
    document.querySelector("section").addEventListener("click", storeAvatar);
}

function loadUserInformation() {
    loadUsername();
    loadAvatar();
}

init();
