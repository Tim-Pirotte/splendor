import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderNonValidPlayerName, renderPlayerInfo } from "./renderer.js";
import { validatePlayerName } from "./validator.js";

function toggleAvatarListVisibility(e) {
    document.querySelector(".avatar-selector section").classList.toggle("none");
}

function updateSelectedAvatar(e) {
    saveToStorage("avatar", e.target.closest("img").title);
    renderPlayerInfo();
    toggleAvatarListVisibility();
}

function savePlayerInfo(e) {
    e.preventDefault();

    const playerName = document.querySelector("#username").value.trim();
 
    if (document.querySelector("form").reportValidity() && validatePlayerName(playerName)) {
        saveToStorage("playerName", playerName);
        saveToStorage("avatar", document.querySelector("#avatar li img").alt);

        if (["join-game", "create-game"].includes(e.target.value)) {
            location.href = `./pages/${e.target.value}.html`;
        }
    } else {
        renderNonValidPlayerName();
    }
}

export { updateSelectedAvatar, toggleAvatarListVisibility, savePlayerInfo };
