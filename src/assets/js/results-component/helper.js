import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function getUser(){
    return loadFromStorage("playerName");
 }

/**
 * Reduce and sort current game data to only include name and points
 * @param {*} data game data
 * @returns
 */
function filterResults(data) {
    return data.players
        .map(player => ({ name: player.name, points: player.totalPrestigePoints }))
        .sort((a, b) => a - b);
}

/**
 * Fetch and return current game reults
 * @returns sorted final game results
 */
function getResults() {
    const gameId = loadFromStorage("gameId");
    return fetchFromServer(`/games/${gameId}`, "GET")
        .then(data => filterResults(data));
}

export { getResults, getUser };
