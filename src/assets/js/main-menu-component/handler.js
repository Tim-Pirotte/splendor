/* utils */
import { redirectToPage } from "../utils/navigation.js";
import { toggleAvatarListVisibility } from "../utils/dom-utils.js";

/* component exports/imports */
import { loadFromStorage, saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderSelectedAvatars } from "./renderer.js";

/*** Load the saved username from storage and set it in the input field ***/
function loadUsername() {
    const $username = document.querySelector("#username");
    const username = loadFromStorage("playerName");

    if (username) {
        $username.value = username;
    }
}

/*** Load the saved avatar from storage and render it or use a placeholder instead ***/
function loadAvatar() {
    renderSelectedAvatars(loadFromStorage("avatar") || "placeholder");
}

/*** Store the entered username in storage and navigate if needed ***/
function storeUsername(e) {
    e.preventDefault();

    const $form = document.querySelector("form");
    const username = document.querySelector("#username").value.trim();

    if ($form.reportValidity()) {
        saveToStorage("avatar", loadFromStorage("avatar") || "placeholder");
        saveToStorage("playerName", username);

        if (["join-game", "create-game"].includes(e.target.value)) {
            redirectToPage(e.target.value);
        }
    }
}

/*** Store the selected avatar in storage and update the html ***/
function storeAvatar(e) {
    e.preventDefault();

    const avatar = e.target.closest("img").title;

    if (avatar) {
        saveToStorage("avatar", avatar);
        renderSelectedAvatars(avatar);
        toggleAvatarListVisibility(e);
    }
}

export { loadUsername, loadAvatar, storeUsername, storeAvatar };
