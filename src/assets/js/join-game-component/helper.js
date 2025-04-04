import * as API from "../api.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";

function locateToMainMenu() {
    location.href = "./../index.html";
}

function joinGameById(gameId) {
    API.joinGame(gameId)
        .then(response => {
            saveToStorage("gameId", response["gameId"]);
            saveToStorage("playerToken", response["playerToken"]);
            location.href = "./lobby-page.html";
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

export { locateToMainMenu, joinGameById, intersection };
