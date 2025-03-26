import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function filterResults(data) {
    return data.players
        .map(player => ({ name: player.name, points: player.totalPrestigePoints }))
        .sort((a, b) => a - b);
}

function getResults() {
    const gameId = loadFromStorage("gameId");
    return fetchFromServer(`/games/${gameId}`, "GET")
        .then(data => filterResults(data));
}

export { getResults, filterResults };
