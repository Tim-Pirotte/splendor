import * as API from "../api.js";
import {sumObjectValues} from "../utils/game-object-handler.js";

function getResults() {
    return API.getGame()
        .then(gameData => filterResults(gameData));
}

function filterResults(gameData) {
    const players = gameData.players
        .map(player => ({
           name: player.name,
           points: player["totalPrestigePoints"],
           amountOfBonuses: getAmountOfBonuses(player)
        }));

    players.sort((a, b) => b.points - a.points);
    players.sort((a, b) => b.amountOfBonuses - a.amountOfBonuses);

    const topPlayer = players[0];
    players.forEach(player => {
        player.isWinner = player.points === topPlayer.points && player.amountOfBonuses === topPlayer.amountOfBonuses;
    });

    return players;
}

function getAmountOfBonuses(player) {
    return sumObjectValues(player["bonuses"]);
}

export { getResults };
