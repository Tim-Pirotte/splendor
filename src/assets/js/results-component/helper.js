import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function getResults() {
    const gameId = loadFromStorage("gameId");
    return fetchFromServer(`/games/${gameId}`, "GET")
        .then(gameData => filterResults(gameData));
}

function filterResults(gameData) {
    return gameData.players
        .map(player => ({ name: player.name, points: player["totalPrestigePoints"] }))
        .sort((a, b) => a - b);
}

export { getResults };
