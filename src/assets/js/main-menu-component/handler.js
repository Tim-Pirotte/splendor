import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";
import {renderSelectedAvatars} from "./renderer.js";

function loadUsername() {
    const $username = document.querySelector("#username");
    const username = loadFromStorage("playerName");

    if (username) {
        $username.value = username;
    }
}

function loadAvatar() {
    const avatar = loadFromStorage("avatar");

    if (avatar) {
        renderSelectedAvatars(avatar);
    } else {
        renderSelectedAvatars("placeholder");
    }
}

function storeUsername(e) {
    e.preventDefault();

    const $form = document.querySelector("form");
    const username = document.querySelector("#username").value.trim();

    if ($form.reportValidity()) {
        if (loadFromStorage("avatar") === null) { saveToStorage("avatar", "placeholder") }
        saveToStorage("playerName", username);

        if (["join-game", "create-game"].includes(e.target.value)) {
            location.href = `./pages/${e.target.value}.html`;
        }
    }
}

function storeAvatar(e) {
    e.preventDefault();

    const avatar = e.target.closest("img").getAttribute("title");

    if (avatar) {
        saveToStorage("avatar", avatar);
        renderSelectedAvatars(avatar);
        toggleVisibility(e);
    }
}

function toggleVisibility(e) {
    e.preventDefault();

    const $avatarList = document.querySelector(".avatar-selector section");

    $avatarList.style.display = ($avatarList.style.display === "none") ? "block" : "none";
}

export {loadUsername, loadAvatar, storeUsername, storeAvatar, toggleVisibility};
