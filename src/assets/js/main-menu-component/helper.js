import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";
import {renderSelectedAvatars} from "./renderer.js";

function loadUsername() {
    const $username = document.querySelector("#username");
    const username = loadFromStorage("username");

    if (username) {
        $username.value = username;
    }
}

function loadAvatar() {
    const avatar = loadFromStorage("avatar");

    renderSelectedAvatars(avatar);
}

function storeUsername(e) {
    e.preventDefault();

    const valid = document.querySelector("form").reportValidity();
    const username = document.querySelector("#username").value;

    if (valid && (username.trim() !== "")) {
        saveToStorage("username", username);
        window.location.href = `./pages/${e.target.value}.html`;
    }
}

function storeAvatar(e) {
    e.preventDefault();

    const avatar = e.target.closest("img").getAttribute("title").valueOf();

    saveToStorage("avatar", avatar);
    renderSelectedAvatars(avatar);
}

export {loadUsername, loadAvatar, storeUsername, storeAvatar};
