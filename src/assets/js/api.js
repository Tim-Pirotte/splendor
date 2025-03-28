import { fetchFromServer } from "./data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";

/* Game Management */
function getGames(hasStarted = "") {
    if (hasStarted !== "") {
        return fetchFromServer(`/games?started=${hasStarted}`);
    } else {
        return fetchFromServer(`/games`);
    }
}

function createGame(gameName, numberOfPlayers, playerName) {
    const requestBody = {gameName, numberOfPlayers, playerName}
    return fetchFromServer(`/games`, "POST", requestBody);
}

function getGame() {
    const gameId = loadFromStorage("gameId");
    return fetchFromServer(`/games/${gameId}`);
}

function joinGame() {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("playerName");
    return fetchFromServer(`/games/${gameId}/players/${playerName}`, "POST");
}

/* Game Actions */
function takeTokens(requestBody) {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("playerName");
    return fetchFromServer(`/games/${gameId}/players/${playerName}/tokens`, "PATCH", requestBody);
}

export { getGames, createGame, getGame, joinGame, takeTokens };
