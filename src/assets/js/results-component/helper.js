import * as API from "../api.js";
import {sumObjectValues} from "../utils/game-object-handler.js";

function getResults() {
    return API.getGame()
        .then(gameData => filterResults(gameData));
}

function filterResults(gameData) {
    return API.getGame()
        .then(({ players }) => {
            const results = players.map(player => ({
                name: player.name,
                points: player["totalPrestigePoints"],
                amountOfBonuses: getAmountOfBonuses(player)
            }))
            .sort((a, b) => b.points - a.points || b.amountOfBonuses - a.amountOfBonuses);

            const topPlayerScore = results[0].points;
            const topPlayerBonuses = results[0].amountOfBonuses;

            /* Each player spreads their existing properties and adds 'winner: true' if they have
               the highest points and bonuses. This allows multiple winners in case of ties. (ChatGPT) */
            return results.map(player => ({
                ...player, isWinner: player.points === topPlayerScore && player.amountOfBonuses === topPlayerBonuses
            }));
        });
}

function getAmountOfBonuses(player) {
    return sumObjectValues(player["bonuses"]);
}

export { getResults };
