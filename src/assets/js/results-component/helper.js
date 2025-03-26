import { fetchFromServer } from "../data-connector/api-communication-abstractor";
import { getGameId } from "../join-game-component/object-handler";


function filterResults(data) {
    return data.players
        .map(player => ({ name: player.name, points: player.totalPrestigePoints }))
        .sort((a, b) => a - b);
}

function getResults() {
    const gameId = getGameId();
    return fetchFromServer(`/games/${gameId}`, "GET")
        .then(data => filterResults(data));
}

export { getResults };