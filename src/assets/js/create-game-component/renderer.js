import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { insertImageInto } from "../utils/renderer.js";

function renderPlayerInfo() {
    const playerName = loadFromStorage("playerName");
    const avatar = loadFromStorage("avatar");

    document.querySelector("#player-name").textContent = playerName;
    insertImageInto(document.querySelector("#player-information"), `avatars/${avatar}`, false, avatar);
}

function removeVisibilitySelector() {
    document.querySelector("#visibility-selector-container").remove();
}

export { renderPlayerInfo, removeVisibilitySelector };
