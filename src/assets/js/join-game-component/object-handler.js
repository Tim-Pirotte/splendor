function getGameState(game){
    return game['started'] ? "spectate" : "join";
}

function getGameName(game){
    return game['gameName'] == null ? "no name loser" : game['gameName'];
}

function getGameId(game){
    return game['gameId'];
}

function getCurrentUsersAmount(game){
    return game['players'].length;
}

function getMaxUsersAmount(game){
    return game['numberOfPlayers'];
}


export { getGameState, getGameName, getGameId, getCurrentUsersAmount, getMaxUsersAmount };