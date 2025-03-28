import * as API from "../api.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function getResults() {
    const gameId = loadFromStorage("gameId");
    return API.getGame()
        .then(gameData => filterResults(gameData));
}

function filterResults(gameData) {
    return gameData.players
        .map(player => ({ name: player.name, points: player["totalPrestigePoints"] }))
        .sort((a, b) => a - b);
}

export { getResults };
