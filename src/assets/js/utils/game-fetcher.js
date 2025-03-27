import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";

function fetchGameStatus(endpointAddition, handleResponse) {
    const gameId = loadFromStorage("gameId");

    fetchFromServer(`/games/${gameId}${endpointAddition}`, "GET")
        .then(data => handleResponse(data))
        .catch(error => console.error(error));
}

export { fetchGameStatus };
