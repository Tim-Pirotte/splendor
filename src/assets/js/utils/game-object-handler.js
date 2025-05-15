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
    return gameData["players"].length;
}

function getMaxUsersAmount(gameData) {
    return gameData["numberOfPlayers"];
}

function getGameCreator(gameData, started) {
    return started ? gameData["players"][0]["name"] : gameData["players"][0];
}

function getPlayersObjects(gameData, started) {
    const players = [];

    for (const player of gameData["players"]) {
        if (player == null) {
            players.push(null);
        } else {
            players.push({
                "name": started ? player.name: player, "avatar": started ? player.avatar : gameData["avatars"][player]
            });
        }
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

function convertAvatarToCorrectCasing(avatar) {
    return avatar.replaceAll(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
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
    convertAvatarToCorrectCasing,
};

