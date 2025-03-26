function filterGameList(gameList){
    console.log(filterOnPeopleAmount(gameList, 2));
    console.log(filterOnName(gameList, "GID"))
}

function filterOnPeopleAmount(gameList, amount){
    const filterGameList = gameList.filter(game => parseInt(game['numberOfPlayers']) === amount);
    return new Set(filterGameList);
}

function filterOnName(gamelist, namePart){
    const filterGameList = gamelist.filter(game => checkIfPartIsInGameName(game, namePart));
    return new Set(filterGameList);
}

function checkIfPartIsInGameName(game, namePart){
    const gameName = game['gameName'];
    if(gameName !== null){
        return gameName.includes(namePart);
    }

    return false;
}

export { filterGameList }