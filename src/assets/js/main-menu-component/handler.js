import { saveToStorage} from "../data-connector/local-storage-abstractor.js";
import { renderPlayerInfo } from "./renderer.js";
import { toggleAvatarListVisibility } from "./helper.js";

function updateSelectedAvatar(e) {
    saveToStorage("avatar", e.target.closest("img").title);
    renderPlayerInfo();
    toggleAvatarListVisibility();
}

function savePlayerInfo(e) {
    e.preventDefault();

    if (document.querySelector("form").reportValidity()) {
        saveToStorage("playerName", document.querySelector("#username").value.trim());

        if (["join-game", "create-game"].includes(e.target.value)) {
            location.href = `./pages/${e.target.value}.html`;
        }
    }
}

export { updateSelectedAvatar, savePlayerInfo };
