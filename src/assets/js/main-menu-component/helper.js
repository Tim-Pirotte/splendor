import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { renderSelectedAvatars } from "./renderer.js";

function loadPlayerName() {
    const $username = document.querySelector("#username");
    if (loadFromStorage("playerName")) $username.value = loadFromStorage("playerName");
}

function loadAvatar() {
    renderSelectedAvatars(loadFromStorage("avatar") || "placeholder");
}

function toggleAvatarListVisibility(e) {
    e.preventDefault();

    const $avatarList = document.querySelector(".avatar-selector section");
    $avatarList.style.display = ($avatarList.style.display === "none") ? "block" : "none";
}

export { loadPlayerName, loadAvatar, toggleAvatarListVisibility };
