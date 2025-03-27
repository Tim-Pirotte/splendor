function getGameState(gameData){
    return gameData["started"] ? "spectate" : "join";
}

function getGameName(gameData){
    return gameData["gameName"];
}

function getGameId(gameData){
    return gameData["gameId"];
}

function getCurrentUsersAmount(gameData){
    return gameData["players"].length;
}

function getMaxUsersAmount(gameData){
    return gameData["numberOfPlayers"];
}

function getGameCreator(gameData) {
    return gameData["players"][0];
}

function getPlayersObjects(gameData) {
    return gameData["players"];
}

function hasGameStarted(gameData){
    return gameData["started"];
}

export {getGameState, getGameName, getGameId, getCurrentUsersAmount, getMaxUsersAmount, getGameCreator, getPlayersObjects, hasGameStarted};
