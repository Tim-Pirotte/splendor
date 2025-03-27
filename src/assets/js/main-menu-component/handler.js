import { redirectToPage } from "../utils/navigation.js";

import { loadFromStorage, saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { toggleAvatarListVisibility } from "./helper.js";
import { renderSelectedAvatars } from "./renderer.js";

function loadUsername() {
    const $username = document.querySelector("#username");
    const username = loadFromStorage("playerName");

    if (username) {
        $username.value = username;
    }
}

function loadAvatar() {
    renderSelectedAvatars(loadFromStorage("avatar") || "placeholder");
}

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
