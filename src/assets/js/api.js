import {fetchFromServer} from "./data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "./data-connector/local-storage-abstractor.js";

/* Game Management */
function getGames(hasStarted = "") {
    if (hasStarted !== "") {
        return fetchFromServer(`/games?started=${hasStarted}`);
    } else {
        return fetchFromServer("/games");
    }
}

export { getGames };
