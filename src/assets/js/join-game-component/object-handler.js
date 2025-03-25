function getGameState(game){};

function getGameName(game){
    return game['gameName'] == null ? "no name loser" : game['gameName'];
};

function getGameId(game){
    return game['gameId'];
};

function getCurrentUsersAmount(game){
    return game['players'].length;
};

function getMaxUsersAmount(game){};


export { getGameState, getGameName, getCurrentUsersAmount, getMaxUsersAmount };