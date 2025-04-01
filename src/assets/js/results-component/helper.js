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
                amountOfBonuses: sumObjectValues(player["bonuses"])
            })).sort((a, b) => b.points - a.points || b.amountOfBonuses - a.amountOfBonuses);

            const topScore = results[0]?.points;
            const topBonuses = results[0]?.amountOfBonuses;

            /* ...player was a suggestion of chat-gpt */
            return results.map(player => ({
                ...player,
                isWinner: player.points === topScore && player.amountOfBonuses === topBonuses
            }));
        });
}

function getAmountOfBonuses(player) {
    return sumObjectValues(player["bonuses"]);
}

export { getResults };
