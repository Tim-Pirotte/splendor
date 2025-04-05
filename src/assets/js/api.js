import { fetchFromServer } from "./data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";
import {isCompatible} from "./server-version-component/server-version.js";

/* Game Management */
function getGames(hasStarted = "") {
    if (hasStarted !== "") {
        return fetchFromServer(`/games?started=${hasStarted}`);
    } else {
        return fetchFromServer("/games");
    }
}

function createGame(requestBody) {
    return isCompatible(2).then(isOk => {
        if (isOk) requestBody.avatar = loadFromStorage("avatar");
        return fetchFromServer("/games", "POST", requestBody);
    });
}

function getGame() {
    const gameId = loadFromStorage("gameId");
    return fetchFromServer(`/games/${gameId}`);
}

function joinGame(gameId) {
    return isCompatible(2).then(isOk => {
        let body = {};
        if (isOk) body = { avatar: loadFromStorage("avatar") };

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
    return fetchFromServer(`/games/${gameId}/players/${playerName}/reserve`, "DELETE", requestBody);
}

function buyReserveCard(developmentName, requestBody) {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("playerName");
    return fetchFromServer(`/games/${gameId}/players/${playerName}/reserve/${developmentName}`, "POST", requestBody);
}

function takeNobels(requestBody) {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("playerName");
    return fetchFromServer(`/games/${gameId}/players/${playerName}/nobels`, "POST", requestBody);
}

function getApiInfo() {
    return fetchFromServer("/info");
}

export { getGames, createGame, getGame, joinGame, takeTokens, buyCard, reserveCard, buyReserveCard, takeNobels, getApiInfo };
