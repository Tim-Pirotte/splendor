import { fetchFromServer } from "./data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";
import { checkCompatibility } from "./server-version-component/server-version.js";
import { IN_GAME_POLLING_TIME_OUT } from "./config.js";
import { handleGameDataError } from "./board-component/game-data-handler.js";
import {locateToMainMenu} from "./utils/data-handler.js";

/* Game Management */
function getGames(hasStarted = "") {
    if (hasStarted !== "") {
        return fetchFromServer(`/games?started=${hasStarted}`);
    } else {
        return fetchFromServer("/games");
    }
}

function createGame(requestBody) {
    return fetchFromServer("/games", "POST", requestBody);
}

function getGame(functionToRunUponFailure) {
    const gameId = loadFromStorage("gameId");
    return fetchFromServer(`/games/${gameId}`).catch(err => {
        handleGameDataError(err);
        setTimeout(functionToRunUponFailure, IN_GAME_POLLING_TIME_OUT);
    });
}

function joinGame(gameId, spectatingEnabled, forfeit) {
    return checkCompatibility(2).then(isCompatible => {
        let body = {};

        if (isCompatible) {
            body = { "avatar": loadFromStorage("avatar").split("-")
                .map(word => (word[0].toUpperCase() + word.slice(1)))
                .join(""),
            "spectatingEnabled": spectatingEnabled,
            "forfeit": forfeit,
            };
        }

        const playerName = loadFromStorage("playerName");
        return fetchFromServer(`/games/${gameId}/players/${playerName}`, "POST", body);
    });
}

/* Game Actions */
function takeTokens(requestBody) {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("playerName");
    return fetchFromServer(`/games/${gameId}/players/${playerName}/tokens`, "PATCH", requestBody);
}

function buyCard(requestBody) {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("playerName");
    return fetchFromServer(`/games/${gameId}/players/${playerName}/developments`, "POST", requestBody);
}

function reserveCard(requestBody) {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("playerName");
    return fetchFromServer(`/games/${gameId}/players/${playerName}/reserve`, "POST", requestBody);
}

function takeNobles(requestBody) {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("playerName");
    return fetchFromServer(`/games/${gameId}/players/${playerName}/nobles`, "POST", requestBody);
}

function leaveGame() {
    joinGame(loadFromStorage("gameId"), true, true)
        .then(() => locateToMainMenu())
        .catch(() => locateToMainMenu());
}

function getApiInfo() {
    return fetchFromServer("/info");
}

export { getGames, createGame, getGame, joinGame, takeTokens, buyCard, reserveCard, takeNobles, getApiInfo, leaveGame };
