import * as API from "../api.js";
import { sumObjectValues } from "../utils/game-object-handler.js";

function getSortedResults() {
    return API.getGame()
        .then(({ players }) => {
            const results = players.map(player => ({
                name: player.name,
                points: player["totalPrestigePoints"],
                amountOfBonuses: getAmountOfBonuses(player),
            }))
                .sort((a, b) => b.points - a.points || b.amountOfBonuses - a.amountOfBonuses);

            const topPlayerScore = results[0].points;
            const topPlayerBonuses = results[0].amountOfBonuses;

            return results.map(player => ({
                ...player, isWinner: getWinner(player, topPlayerScore, topPlayerBonuses),
            }));
        });
}

function getAmountOfBonuses(player) {
    return sumObjectValues(player["bonuses"]);
}

function getWinner(player, topPlayerScore, topPlayerBonuses) {
    return player.points === topPlayerScore && player.amountOfBonuses === topPlayerBonuses;
}

export { getSortedResults };
