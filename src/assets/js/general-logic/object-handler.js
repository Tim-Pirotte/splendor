function getGameState(gameData){
    return gameData["started"] ? "spectate" : "join";
}

function getGameName(gameData){
    return gameData["gameName"] == null ? `${getGameCreator()}'s game` : gameData["gameName"];
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
    return gameData["players"][0]["name"];
}

export {getGameState, getGameName, getGameId, getCurrentUsersAmount, getMaxUsersAmount, getGameCreator};
