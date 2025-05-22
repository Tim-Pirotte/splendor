import { avatars } from "./data.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { insertImageInto } from "../utils/renderer.js";

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

    insertImageInto($button, `avatars/${avatar}`, false, avatar, ".");

    if (playerName) {
        document.querySelector("#username").value = playerName;
    }
}

export { renderAvatarSelectionList, renderPlayerInfo };
