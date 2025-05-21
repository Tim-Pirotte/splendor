import { avatars } from "./data.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { insertImageInto } from "../utils/renderer.js";
import { ERROR_MESSAGE_TIMEOUT } from "../config.js";

function renderAvatarSelectionList() {
    const $avatarsSection = document.querySelector("section ul");

    document.querySelectorAll("li").forEach(li => li.remove());
    avatars.forEach(avatar => insertImageInto($avatarsSection, `avatars/${avatar}`, false, avatar, "."));
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

// TODO: change this to the function that is used in the join-game-component -> change that function and put it in a utils folder
function renderNonValidPlayerName() {
    const $target = document.querySelector(".error-message");
    $target.classList.remove("none");
    $target.innerHTML = "<p>Invalid playername: (no spaces or special characters).</p>";

    setTimeout(() => $target.classList.add("none"), ERROR_MESSAGE_TIMEOUT);
}

export { renderAvatarSelectionList, renderPlayerInfo, renderNonValidPlayerName };
