import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { addImageToContainer } from "../utils/renderer.js";

function renderPlayerInfo() {
    document.querySelector("#playerName").textContent = loadFromStorage("playerName");

    const $playerInformation = document.querySelector("#playerInformation");
    const avatar = loadFromStorage("avatar");
    addImageToContainer($playerInformation, `avatars/${avatar}`, false, avatar);
}

export { renderPlayerInfo };
