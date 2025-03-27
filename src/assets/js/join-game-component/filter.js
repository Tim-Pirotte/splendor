function filterGameList(gameList) {

    const amountValue = document.querySelector("#amount-filter").value;
    const peopleFilteredSet = filterOnPeopleAmount(gameList, amountValue);

    const gameName = document.querySelector("#game-name").value;
    const nameFilteredSet = filterOnName(gameList, gameName);

    return peopleFilteredSet.intersection(nameFilteredSet);
}

function filterOnPeopleAmount(gameList, amount) {
    let filteredList = gameList;
    if (amount !== "any") {
        filteredList = gameList.filter(game => parseInt(game['numberOfPlayers']) === parseInt(amount));
    }
    return new Set(filteredList);
}

function filterOnName(gamelist, namePart) {
    const filteredList = gamelist.filter(game => checkIfPartIsInGameName(game, namePart));
    return new Set(filteredList);
}


function checkIfPartIsInGameName(game, namePart) {
    const gameName = game['gameName'];
    if (gameName !== null) {
        return gameName.toLowerCase().includes(namePart.toLowerCase());
    }

    return false;
}

export { filterGameList };