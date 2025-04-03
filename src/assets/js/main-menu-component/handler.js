import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderPlayerInfo } from "./renderer.js";
import { toggleAvatarListVisibility } from "./helper.js";

function updateSelectedAvatar(e) {
    saveToStorage("avatar", e.target.closest("img").title);
    renderPlayerInfo();
    toggleAvatarListVisibility();
}

export { updateSelectedAvatar };
