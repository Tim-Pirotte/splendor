import { avatars } from "../main-menu-component/data.js";

function getGameState(gameData) {
    return gameData["started"] ? "spectate" : "join";
}

function getGameName(gameData) {
    return gameData["gameName"];
}

function getGameId(gameData) {
    return gameData["gameId"];
}

function getCurrentUsersAmount(gameData) {
    return gameData["players"].filter(player => player !== null).length;
}

function getMaxUsersAmount(gameData) {
    return gameData["numberOfPlayers"];
}

function getGameCreator(gameData, started) {
    for(const player of gameData["players"]) {
        if (player !== null) {
            return started ? player["name"] : player;
        }
    }
}

function getPlayersObjects(gameData, started) {
    const players = [];

    for (const player of gameData["players"]) {
        players.push({
            "name": started ? player.name : player,
            "avatar": started ? player.avatar : gameData["avatars"][player]
        });
    }

    return players;
}

function hasGameStarted(gameData) {
    return gameData["started"];
}

function sumObjectValues(object) {
    return Object.values(object).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function getHighestScore(players) {
    return Math.max(...players.map(player => player["totalPrestigePoints"]));
}

function getPlayerByName(players, currentPlayerName) {
    for (const player of players) {
        if (player.name === currentPlayerName) {
            return player;
        }
    }
}

function determinePlayerAvatar(playerName, avatar) {
    if (!avatar) {
        const avatarIndex = playerName.toLowerCase().charCodeAt(0) % avatars.length;
        avatar =  avatars[avatarIndex];
    }

    return avatar.toLowerCase();
}

export {
    getGameState,
    getGameName,
    getGameId,
    getCurrentUsersAmount,
    getMaxUsersAmount,
    getGameCreator,
    getPlayersObjects,
    hasGameStarted,
    sumObjectValues,
    getHighestScore,
    getPlayerByName,
    determinePlayerAvatar,
};

