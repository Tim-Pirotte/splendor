import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderPlayerInfo } from "./renderer.js";

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

    if (document.querySelector("form").reportValidity()) {
        saveToStorage("playerName", document.querySelector("#username").value.trim());
        saveToStorage("avatar", document.querySelector("#avatar li img").alt);

        if (["join-game", "create-game"].includes(e.target.value)) {
            location.href = `./pages/${e.target.value}.html`;
        }
    }
}

export { updateSelectedAvatar, toggleAvatarListVisibility, savePlayerInfo };
