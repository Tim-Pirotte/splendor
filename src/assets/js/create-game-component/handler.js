import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { createGameWithBody, getCheckedRadioButtonValue } from "./helper.js";

function createGame(e) {
    e.preventDefault();
    createGameWithBody({
        playerName: loadFromStorage("playerName"),
        gameName: document.querySelector("#game-name").value.trim() || `${loadFromStorage("playerName")}'s game`,
        visibility: getCheckedRadioButtonValue(document.querySelectorAll("input[name=visibility]")),
        numberOfPlayers: parseInt(getCheckedRadioButtonValue(document.querySelectorAll("input[name=players]"))),
        returnExcessTokensRequired: true,
        pickNobleRequired: true,
    });
}

export { createGame };
