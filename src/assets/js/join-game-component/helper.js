import * as API from "../api.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { checkCompatibility } from "../server-version-component/server-version.js";
import {renderErrorMessage} from "./renderer.js";

function joinGameById(gameId) {
    API.joinGame(gameId, false)
        .then(response => {
            saveToStorage("gameId", response["gameId"]);
            saveToStorage("playerToken", response["playerToken"]);
            location.href = "./lobby.html";
        }).catch(err => {
            renderErrorMessage(err);
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
