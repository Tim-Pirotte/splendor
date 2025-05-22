import * as API from "../api.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderErrorMessage, renderUnsupportedError } from "../utils/renderer.js";
import { checkCompatibility } from "../server-version-component/server-version.js";

function joinGameById(gameId, spectating) {
    initiateGameSession(gameId, spectating);
}

function spectateGameById(gameId) {
    checkCompatibility(2)
        .then(isCompatible => {
            if (!isCompatible) {
                renderUnsupportedError(document.querySelector(".error-messages"), "Spectating");
            } else {
                initiateGameSession(gameId, true);
            }
        });
}

function initiateGameSession(gameId, spectating) {
    API.joinGame(gameId, loadFromStorage("playerName"), spectating, false).then(response => {
        saveToStorage("gameId", response["gameId"]);
        saveToStorage("playerToken", response["playerToken"]);
        location.href = "./lobby.html";
    }).catch(err => {
        renderErrorMessage(err.cause);
    });
}

function intersection(setA, setB) {
    const result = new Set();

    for (const item of setA) {
        if (setB.has(item)) {
            result.add(item);
        }
    }

    return result;
}

export { joinGameById, intersection, spectateGameById };
