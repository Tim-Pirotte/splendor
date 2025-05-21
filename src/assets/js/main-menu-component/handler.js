import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderErrorMessage } from "../utils/renderer.js";
import { renderPlayerInfo } from "./renderer.js";
import { validatePlayerName } from "./validator.js";

function toggleAvatarListVisibility(e) {
    document.querySelector(".avatar-selector section").classList.toggle("none");
}

function updateSelectedAvatar(e) {
    saveToStorage("avatar", e.target.closest("img").title);
    renderPlayerInfo();
    toggleAvatarListVisibility();
}

function savePlayerInfo(e) {
    e.preventDefault();

    const playerName = document.querySelector("#username").value.trim();

    if (document.querySelector("form").reportValidity() && validatePlayerName(playerName)) {
        savePlayerInfoToLocalStorage(playerName);

        if (["join-game", "create-game"].includes(e.target.value)) {
            location.href = `./pages/${e.target.value}.html`;
        }
    } else {
        renderErrorMessage("Invalid playername: (no spaces or special characters).");
    }
}

function savePlayerInfoToLocalStorage(playerName) {
    saveToStorage("playerName", playerName);
    saveToStorage("avatar", document.querySelector("#avatar li img").alt);
}

function closeAvatarVisibility(e) {
    if (e.target.closest("button")?.getAttribute("id") === "avatar") {
        toggleAvatarListVisibility(e);
        return;
    }

    if (!document.querySelector(".avatar-selector section").classList.contains("none")) {
        toggleAvatarListVisibility(e);
        return;
    };
}

export { updateSelectedAvatar, toggleAvatarListVisibility, savePlayerInfo, closeAvatarVisibility };
