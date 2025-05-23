import { avatars } from "./data.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import {insertImageInto, renderErrorMessage} from "../utils/renderer.js";

function renderAvatarSelectionList() {
    const $avatarsSection = document.querySelector("section ul");

    avatars.forEach(avatar => {
        const $li = document.createElement("li");
        insertImageInto($li, `avatars/${avatar}`, false, avatar, ".");
        $avatarsSection.appendChild($li);
    });
}

function renderPlayerInfo() {
    const $button = document.querySelector(".avatar-selector button");
    const avatar = loadFromStorage("avatar") || "placeholder";
    const playerName = loadFromStorage("playerName");

    $button.innerHTML = "";

    insertImageInto($button, `avatars/${avatar}`, false, avatar, ".");

    if (playerName) {
        document.querySelector("#username").value = playerName;
    }
}

function hideDemoButton(compatible) {
    if(!compatible) document.querySelector("form .form-actions button[value='demo']").classList.add("none");
}

function renderCorrectErrorMessage() {
    if (new URL(window.location.href).searchParams.get("gameId") === null) return;

    renderErrorMessage(
        loadFromStorage("playerName")
            ? "Player name already taken"
            : "Please choose a player name before going back to the join page"
    );
}

export { renderAvatarSelectionList, renderPlayerInfo, hideDemoButton, renderCorrectErrorMessage};
