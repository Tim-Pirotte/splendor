import * as API from "../api.js";

function getResults() {
    return API.getGame()
        .then(gameData => filterResults(gameData));
}

function filterResults(gameData) {
    return gameData.players
        .map(player => ({ name: player.name, points: player["totalPrestigePoints"] }))
        .sort((a, b) => a - b);
}

export { getResults };
