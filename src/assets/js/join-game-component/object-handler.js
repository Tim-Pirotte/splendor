function getGameState(game){};

function getGameName(game){
    return game['gameName'] == null ? "no name loser" : game['gameName']
};

function getCurrentUsersAmount(game){}

function getMaxUsersAmount(game){}


export { getGameState, getGameName, getCurrentUsersAmount, getMaxUsersAmount }