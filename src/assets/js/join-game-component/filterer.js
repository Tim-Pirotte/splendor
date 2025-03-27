function filterGameList(gameList){

    const amountValue = document.querySelector("#amount-filter").value;
    const peopleFilteredSet = filterOnPeopleAmount(gameList, amountValue);

    const gameName = document.querySelector("#game-name").value;
    const nameFilteredSet = filterOnName(gameList, gameName);

    const resultList = Array.from(peopleFilteredSet.intersection(nameFilteredSet));
    return resultList;
}

function filterOnPeopleAmount(gameList, amount){
    let filterGameList = gameList;
    if(amount !== "any"){
        filterGameList = gameList.filter(game => parseInt(game['numberOfPlayers']) === parseInt(amount));
    }
    return new Set(filterGameList);
}

function filterOnName(gamelist, namePart){
    const filterGameList = gamelist.filter(game => checkIfPartIsInGameName(game, namePart));
    return new Set(filterGameList);
}


function checkIfPartIsInGameName(game, namePart){
    const gameName = game['gameName'];
    if(gameName !== null){
        return gameName.toLowerCase().includes(namePart.toLowerCase());
    }

    return false;
}

export { filterGameList }