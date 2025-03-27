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

    if ($form.reportValidity() && username !== "") {
        saveToStorage("playerName", username);
        location.href = `./pages/${e.target.value}.html`;
    }
}

function storeAvatar(e) {
    e.preventDefault();

    const avatar = e.target.closest("img").getAttribute("title");

    if (avatar) {
        saveToStorage("avatar", avatar);
        renderSelectedAvatars(avatar);
    }
}

function toggleVisibility() {
    const $avatarList = document.querySelector(".avatar-selector section");

    if ($avatarList.style.display === "none") {
        $avatarList.style.display = "block";
    } else {
        $avatarList.style.display = "none";
    }
}

export {loadUsername, loadAvatar, storeUsername, storeAvatar, toggleVisibility};
