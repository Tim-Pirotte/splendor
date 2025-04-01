import * as API from "../api.js";
import {sumObjectValues} from "../utils/game-object-handler.js";

function getResults() {
    return API.getGame()
        .then(gameData => filterResults(gameData));
}

function filterResults(gameData) {
    return gameData.players
        .map(player => ({
            name: player.name,
            points: player["totalPrestigePoints"],
            amountOfBonuses: getAmountOfBonuses(player)
        }))
        .sort((a, b) => b.points - a.points)
        .sort((a, b) => b.amountOfBonuses - a.amountOfBonuses);
}

function getAmountOfBonuses(player) {
    console.log(player)
    return sumObjectValues(player["bonuses"]);
}

export { getResults };
