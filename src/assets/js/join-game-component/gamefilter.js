import { intersection } from "./helper.js";

function filterGames(gameList, isCompatible) {
    const standardFiltered = filterStandard(gameList);
    if (!isCompatible) {
        return intersection(standardFiltered, filterByStarted(gameList));
    }

    return standardFiltered;
}

function filterStandard(gameList) {
    return intersection(
        filterByPlayerCount(gameList, document.querySelector("#amount-filter").value),
        filterByName(gameList, document.querySelector("#game-name").value),
    );
}

function filterByStarted(gameList) {
    return new Set(gameList.filter(game => !game.started));
}

function filterByPlayerCount(games, amount) {
    if (amount === "any") {
        return new Set(games);
    } else {
        return new Set(games.filter(game => parseInt(game["numberOfPlayers"]) === parseInt(amount)));
    }
}

function filterByName(games, name) {
    return new Set(games.filter(game => game.gameName.toLowerCase().includes(name.toLowerCase().trim())));
}

export { filterGames };
