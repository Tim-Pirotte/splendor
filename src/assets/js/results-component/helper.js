import * as API from "../api.js";
import { sumObjectValues } from "../utils/game-object-handler.js";
import { GAME_STATE } from "../board-component/state-machine/data.js";

function getSortedResults() {
    return API.getGame()
        .then(gameData => {
            console.log(gameData);
            if (gameData.gameState !== GAME_STATE.WINNER_IS_FOUND) location.href = "./board.html";

            const results = gameData.players.map(player => ({
                name: player.name,
                points: player["totalPrestigePoints"],
                amountOfBonuses: getAmountOfBonuses(player),
            })).sort((a, b) => compareByPointsThenBonuses(b, a));

            addPositionToPlayers(results);

            const topPlayerScore = results[0].points;
            const topPlayerBonuses = results[0].amountOfBonuses;

            return results.map(player => ({ ...player, isWinner: getWinner(player, topPlayerScore, topPlayerBonuses) }));
        });
}

function getAmountOfBonuses(player) {
    return sumObjectValues(player["bonuses"]);
}

function compareByPointsThenBonuses(b, a) {
    return b.points - a.points || b.amountOfBonuses - a.amountOfBonuses;
}

function getWinner(player, topPlayerScore, topPlayerBonuses) {
    return player.points === topPlayerScore && player.amountOfBonuses === topPlayerBonuses;
}

//this function was made because sonar cried about me using Math.random
function getRandomNumber(max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);

    const randomNumber = arr[0];

    //by dividing by one above the maximum number it becomes exclusive
    //we use 32bit since this function is used for rendering images in a random place and otherwise it would look horrible
    return (randomNumber / (2 ** 32)) * max;
}

function addPositionToPlayers(players) {
    for (const index in players) players[index]["position"] = parseInt(index) + 1;

    for (let i = 1; i < players.length; i++) {
        if (compareByPointsThenBonuses(players[i], players[i - 1]) === 0) players[i]["position"] = players[i - 1]["position"];
    }
}
export { getSortedResults, getRandomNumber };
