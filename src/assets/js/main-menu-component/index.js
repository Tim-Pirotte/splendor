/* utils */
import { toggleVisibility } from "../utils/dom-utils.js";

/* component exports/imports */
import { loadAvatar, loadUsername, storeAvatar, storeUsername } from "./handler.js";
import { renderSelectableAvatars } from "./renderer.js";

/*** Entry point to the js ***/
function init() {
    renderSelectableAvatars();
    loadSavedUserInformation();
    addEventListeners();
}

/*** Load saved user information (if present in local storage) ***/
function loadSavedUserInformation() {
    loadUsername();
    loadAvatar();
}

/*** Add event listeners to html attributes ***/
function addEventListeners() {
    document.querySelector(".form-actions").addEventListener("click", storeUsername);
    document.querySelector(".avatar-selector button").addEventListener("click", toggleVisibility);
    document.querySelector(".avatar-selector section").addEventListener("click", storeAvatar);
}

init();
