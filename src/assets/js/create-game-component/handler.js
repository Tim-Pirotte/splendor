import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { createGameWithBody, getCheckedRadioButtonValue } from "./helper.js";
import {checkCompatibility} from "../server-version-component/server-version.js";

function locateMainMenu(e) {
    location.href = "./../index.html";
}

function createGame(e) {
    e.preventDefault();
    checkCompatibility(2)
        .then(isCompatible => {
            const requestBody = {
                playerName: loadFromStorage("playerName"),
                gameName: document.querySelector("#game-name").value.trim() || `${loadFromStorage("playerName")}'s game`,
                visibility: getCheckedRadioButtonValue(document.querySelectorAll("input[name=visibility]")),
                numberOfPlayers: parseInt(getCheckedRadioButtonValue(document.querySelectorAll("input[name=players]"))),
                returnExcessTokensRequired: true,
            };

            if (isCompatible) requestBody.avatar = loadFromStorage("avatar");

            createGameWithBody(requestBody);
        });
}

export { locateMainMenu, createGame };
