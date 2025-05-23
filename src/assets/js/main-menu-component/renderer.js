import {authors, avatars} from "./data.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { insertImageInto } from "../utils/renderer.js";
import {copyNode} from "../utils/data-handler.js";

function renderAvatarSelectionList() {
    const $avatarsSection = document.querySelector("section ul");

    document.querySelectorAll(".avatar-selector li").forEach(li => li.remove());
    avatars.forEach(avatar => insertImageInto($avatarsSection, `avatars/${avatar}`, false, avatar, "."));
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

export { renderAvatarSelectionList, renderPlayerInfo, renderAuthors };
