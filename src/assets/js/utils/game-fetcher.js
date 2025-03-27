import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";

function fetchGameStatus(endpointAddition, callbackFn) {
    const gameId = loadFromStorage("gameId");

    return fetchFromServer(`/games/${gameId}${endpointAddition}`, "GET")
        .then(callbackFn)
        .catch(error => console.error("Error fetching game status:", error));
}

export { fetchGameStatus };
