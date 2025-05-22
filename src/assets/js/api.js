import { fetchFromServer } from "./data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";
import { checkCompatibility } from "./server-version-component/server-version.js";
import { NPC_SUFFIX } from "./config.js";
import { handleGameDataError } from "./board-component/game-data-handler.js";
import { locateToMainMenu } from "./utils/data-handler.js";
import {createGameWithBody, getCheckedRadioButtonValue} from "./create-game-component/helper";

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

function getGame() {
    const gameId = loadFromStorage("gameId");
    return fetchFromServer(`/games/${gameId}`).catch(err => {
        handleGameDataError(err);
    });
}

function joinGame(gameId, playerName, spectatingEnabled, forfeit) {
    return checkCompatibility(2).then(isCompatible => {
        let body = {};

        if (isCompatible) {
            body = {
                "avatar": loadFromStorage("avatar").split("-")
                    .map(word => (word[0].toUpperCase() + word.slice(1)))
                    .join(""),
                "spectatingEnabled": spectatingEnabled,
                "forfeit": forfeit,
            };
        }

        return fetchFromServer(`/games/${gameId}/players/${playerName}`, "POST", body);
    });
}

function createBotGame(){
    const level = 3;
    const numberOfPlayers = 2;
    let gameId;
    const requestBody = {
        playerName: level + NPC_SUFFIX,
        gameName: "BotGame",
        numberOfPlayers: numberOfPlayers,
        returnExcessTokensRequired: true,
        pickNobleRequired: true,
    };
    createGame(requestBody).then(response => {
        gameId =   response["gameId"];
    });
    return gameId;
}

function joinBot(level) {
    joinGame(loadFromStorage("gameId"), level + NPC_SUFFIX, false, false);
}

function leaveGame() {
    joinGame(loadFromStorage("gameId"), loadFromStorage("playerName"),true, true)
        .then(() => locateToMainMenu())
        .catch(() => locateToMainMenu());
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

function skipTurn() {
    takeTokens({ take: {} });
}

export {
    getGames,
    createGame,
    getGame,
    joinGame,
    skipTurn,
    takeTokens,
    buyCard,
    reserveCard,
    takeNobles,
    getApiInfo,
    leaveGame,
    joinBot,
    createBotGame,
};
