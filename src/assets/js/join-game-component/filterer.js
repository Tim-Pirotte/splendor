function filterGameList(gameList){

    const amountValue = parseInt(document.querySelector("#amount-filter").value);
    const peopleFilteredSet = filterOnPeopleAmount(gameList, amountValue);

    const gameName = document.querySelector("#game-name").value;
    const nameFilteredSet = filterOnName(gameList, gameName);

    console.log(peopleFilteredSet);
    console.log(nameFilteredSet);
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