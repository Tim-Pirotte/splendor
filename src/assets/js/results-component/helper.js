import { fetchGameStatus } from "../utils/game-fetcher.js";

function getResults() {
    return fetchGameStatus("/status", filterResults);
}

function filterResults(gameData) {
    return gameData.players
        .map(player => ({ name: player.name, points: player["totalPrestigePoints"] }))
        .sort((a, b) => a - b);
}

export { getResults };
