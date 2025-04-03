import { avatars } from "./data.js";
import { addImageToContainer } from "../utils/renderer.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function renderAvatarSelectionList() {
    const $avatarsSection = document.querySelector("section ul");

    document.querySelectorAll("li").forEach(li => li.remove());
    avatars.forEach(avatar => addImageToContainer($avatarsSection, `avatars/${avatar}`, ".", false, avatar));
}

function renderPlayerInfo() {
    const $button = document.querySelector(".avatar-selector button");
    const avatar = loadFromStorage("avatar") || "placeholder";

    $button.innerHTML = "";
    addImageToContainer($button, `avatars/${avatar}`, ".", false, avatar);

    if (loadFromStorage("playerName")) {
        document.querySelector("#username").value = loadFromStorage("playerName");
    }
}

export { renderAvatarSelectionList, renderPlayerInfo };
