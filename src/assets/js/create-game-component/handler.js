import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { createGameWithBody, getCheckedValue } from "./helper.js";

function locateToMainMenu(e) {
    location.href = "./../index.html";
}

function createGameUsingGui(e) {
    e.preventDefault();
    createGameWithBody({
        playerName: loadFromStorage("playerName"),
        gameName: document.querySelector("#game-name").value.trim() || `${loadFromStorage("playerName")}'s game`,
        visibility: getCheckedValue(document.querySelectorAll("input[name=visibility]")),
        numberOfPlayers: parseInt(getCheckedValue(document.querySelectorAll("input[name=players]"))),
    });
}

export { locateToMainMenu, createGameUsingGui };
