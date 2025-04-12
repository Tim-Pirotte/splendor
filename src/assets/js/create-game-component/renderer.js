import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { insertImageInto } from "../utils/renderer.js";
import {copyNode} from "../utils/data-handler.js";

function renderPlayerInfo() {
    const playerName = loadFromStorage("playerName");
    const avatar = loadFromStorage("avatar");

    document.querySelector("#playerName").textContent = playerName;
    insertImageInto(document.querySelector("#playerInformation"), `avatars/${avatar}`, false, avatar);
}

function removeVisibilitySelector() {
    const $container = document.querySelector("#visibility-selector-container");
    $container.remove()
}

export { renderPlayerInfo, removeVisibilitySelector };
