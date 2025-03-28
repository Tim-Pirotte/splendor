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

function createGame(requestBody) {
    return fetchFromServer(`/games`, "POST", requestBody);
}

function getGame() {
    const gameId = loadFromStorage("gameId");
    return fetchFromServer(`/games/${gameId}`);
}

function joinGame(gameId) {
    const playerName = loadFromStorage("playerName");
    return fetchFromServer(`/games/${gameId}/players/${playerName}`, "POST");
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

/* General */
function getGemsList() {
    return fetchFromServer(`/gems`);
}

function getNoblesList() {
    return fetchFromServer(`/nobles`);
}

function getDevelopmentsList() {
    return fetchFromServer(`/developments`);
}

export { getGames, createGame, getGame, joinGame, takeTokens, buyCard, reserveCard, buyReserveCard, takeNobels, getGemsList, getNoblesList, getDevelopmentsList };
