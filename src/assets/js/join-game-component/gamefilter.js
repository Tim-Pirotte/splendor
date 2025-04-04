import { intersection } from "./helper.js";

function filterGames(gameList) {
    return intersection(
        filterByPlayerCount(gameList, document.querySelector("#amount-filter").value),
        filterByName(gameList, document.querySelector("#game-name").value),
    );
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
