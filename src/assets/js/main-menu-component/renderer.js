import { avatars } from "./data.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { addImageToContainer } from "../utils/renderer.js";

function renderAvatarSelectionList() {
    const $avatarsSection = document.querySelector("section ul");

    document.querySelectorAll("li").forEach(li => li.remove());
    avatars.forEach(avatar => addImageToContainer($avatarsSection, `avatars/${avatar}`, false, avatar, "."));
}

function renderPlayerInfo() {
    const $button = document.querySelector(".avatar-selector button");
    const avatar = loadFromStorage("avatar") || "placeholder";
    const playerName = loadFromStorage("playerName");

    $button.innerHTML = "";
    addImageToContainer($button, `avatars/${avatar}`, false, avatar, ".");

    if (playerName) {
        document.querySelector("#username").value = playerName;
    }
}

export { renderAvatarSelectionList, renderPlayerInfo };
