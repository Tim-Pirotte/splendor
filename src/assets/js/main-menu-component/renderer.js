import { authors, avatars } from "./data.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { copyNode } from "../utils/data-handler.js";
import { insertImageInto, renderErrorMessage } from "../utils/renderer.js";

function renderAvatarSelectionList() {
    const $avatarsSection = document.querySelector("section ul");

    avatars.forEach(avatar => {
        const $li = document.createElement("li");
        insertImageInto($li, `avatars/${avatar}`, false, avatar, ".");
        $avatarsSection.appendChild($li);
    });
}

function renderPlayerInfo() {
    const $button = document.querySelector(".avatar-selector button");
    const avatar = loadFromStorage("avatar") || "placeholder";
    const playerName = loadFromStorage("playerName");

    $button.innerHTML = "";

    insertImageInto($button, `avatars/${avatar}`, false, avatar, ".");

    if (playerName) {
        document.querySelector("#username").value = playerName;
    }
}

function hideDemoButton(compatible) {
    if(!compatible) document.querySelector("form .form-actions button[value='demo']").classList.add("none");
}

function renderAuthors() {
    const $authors = document.querySelector(".authors");
    const $authorTemplate = document.querySelector("#author-template");

    for (const [author, github] of Object.entries(authors)) {
        const $author = copyNode($authorTemplate);

        $author.querySelector("span").textContent = author;
        $author.querySelector("a").href = github;

        $authors.appendChild($author);
    }
}

function renderCorrectErrorMessage() {
    if (new URL(window.location.href).searchParams.get("gameId") === null) return;

    // the user only gets send back to the main menu if he/she doesn't have a playerName or if it is already taken.
    renderErrorMessage(
        loadFromStorage("playerName")
            ? "Player name already taken"
            : "Please choose a player name before going back to the join page",
    );
}

export { renderAvatarSelectionList, renderPlayerInfo, hideDemoButton, renderAuthors, renderCorrectErrorMessage };
