import {loadAvatar, loadUsername, storeUsername} from "./helper.js";
import {renderSelectableAvatars} from "./renderer.js";

function init() {
    renderSelectableAvatars();
    loadUserInformation();
    document.querySelector(".form-actions").addEventListener("click", storeUsername);
}

function loadUserInformation() {
    loadUsername();
    loadAvatar();
}

init();
