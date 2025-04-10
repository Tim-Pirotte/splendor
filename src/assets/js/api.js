import { fetchFromServer } from "./data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";
import { DUMMY_DATA } from "./dummy-data.js";
import { checkCompatibility } from "./server-version-component/server-version.js";

const USE_DUMMY = true;

/* Game Management */
function getGames(hasStarted = "") {
    if (hasStarted !== "") {
        return fetchFromServer(`/games?started=${hasStarted}`);
    } else {
        return fetchFromServer("/games");
    }
}

function createGame(requestBody) {
    return checkCompatibility(2).then(isOk => {
        if (isOk) requestBody.avatar = loadFromStorage("avatar");
        return fetchFromServer("/games", "POST", requestBody);
    });
}

function getGame() {
    if (USE_DUMMY) {
        return Promise.resolve(DUMMY_DATA);;
    }

    const gameId = loadFromStorage("gameId");
    return fetchFromServer(`/games/${gameId}`);
}

function joinGame(gameId) {
    return checkCompatibility(2).then(isCompatible => {
        let body = {};

        if (isCompatible) body = { avatar: loadFromStorage("avatar") };

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

function getApiInfo() {
    return fetchFromServer("/info");
}


export { getGames, createGame, getGame, joinGame, takeTokens, buyCard, reserveCard, takeNobles, getApiInfo };
