import * as API from "../api.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderErrorMessage } from "../utils/renderer.js";

function joinGameById(gameId, spectatingEnabled) {
    API.joinGame(gameId, spectatingEnabled, false)
        .then(response => {
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

export { joinGameById, intersection };
