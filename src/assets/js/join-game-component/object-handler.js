function getGameState(game){};

function getGameName(game){
    if(game['gameName'] == null){
        return "no name"
    }else {
        return game['gameName'];
    }
};

function getCurrentUsersAmount(game){}

function getMaxUsersAmount(game){}


export { getGameState, getGameName, getCurrentUsersAmount, getMaxUsersAmount }