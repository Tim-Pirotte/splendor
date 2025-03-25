import {loadAvatar, loadUsername, storeUsername} from "./helper.js";

function init() {
    loadUserInformation();
    document.querySelector(".form-actions").addEventListener("click", storeUsername);
}

function loadUserInformation() {
    loadUsername();
    loadAvatar();
}

init();
