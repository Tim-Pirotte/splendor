import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { addImageToContainer } from "../utils/renderer.js";

function renderPlayerInfo() {
    const playerName = loadFromStorage("playerName");
    const avatar = loadFromStorage("avatar");

    document.querySelector("#playerName").textContent = playerName;
    addImageToContainer(document.querySelector("#playerInformation"), `avatars/${avatar}`, false, avatar);
}

export { renderPlayerInfo };
