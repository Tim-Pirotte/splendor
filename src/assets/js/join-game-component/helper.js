import * as API from "../api.js";
import { loadFromStorage, saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderErrorMessage, renderUnsupportedError } from "../utils/renderer.js";
import { checkCompatibility } from "../server-version-component/server-version.js";
import {sendBackToMainMenuWithGameId} from "./handler.js";

function joinGameById(gameId, spectating, joinBySharingLink = false) {
    initiateGameSession(gameId, spectating, joinBySharingLink);
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

function initiateGameSession(gameId, spectating, joinBySharingLink) {
    API.joinGame(gameId, loadFromStorage("playerName"), spectating, false).then(response => {
        saveToStorage("gameId", response["gameId"]);
        saveToStorage("playerToken", response["playerToken"]);
        location.href = "./lobby.html";
    }).catch(err => {
        if (joinBySharingLink && err.failure === 409) {
            sendBackToMainMenuWithGameId(gameId);
        } else {
            renderErrorMessage(err.cause);
        }
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
