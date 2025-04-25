import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { createGameWithBody, getCheckedRadioButtonValue } from "./helper.js";
import { checkCompatibility } from "../server-version-component/server-version.js";

function createGame(e) {
    e.preventDefault();
    checkCompatibility(2)
        .then(isCompatible => {
            const visibility = getCheckedRadioButtonValue(document.querySelectorAll("input[name=visibility]"));
            const requestBody = {
                playerName: loadFromStorage("playerName"),
                gameName: document.querySelector("#game-name").value.trim() || `${loadFromStorage("playerName")}'s game`,
                numberOfPlayers: parseInt(getCheckedRadioButtonValue(document.querySelectorAll("input[name=players]"))),
                returnExcessTokensRequired: true,
                pickNobleRequired: true,
            };

            if (isCompatible) {
                requestBody.avatar = loadFromStorage("avatar");
                requestBody.visibility = visibility;
            }

            createGameWithBody(requestBody);
        });
}

export { createGame };
