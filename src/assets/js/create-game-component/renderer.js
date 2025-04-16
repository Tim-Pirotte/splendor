import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { insertImageInto, renderUnsupportedError } from "../utils/renderer.js";

function renderPlayerInfo() {
    const playerName = loadFromStorage("playerName");
    const avatar = loadFromStorage("avatar");

    document.querySelector("#playerName").textContent = playerName;
    insertImageInto(document.querySelector("#playerInformation"), `avatars/${avatar}`, false, avatar);
}

function removeVisibilitySelector() {
    const $container = document.querySelector("#visibility-selector-container");
    renderUnsupportedError($container, "Private game");
}

export { renderPlayerInfo, removeVisibilitySelector };
