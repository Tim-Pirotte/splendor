import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {renderHeader, renderPlayerCount, renderPlayers} from "./renderer.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";

function loadLobbyInformation() {
    fetchFromServer(`/games/${loadFromStorage("gameId")}`, `GET`)
        .then(gameObject => {
            renderHeader(gameObject);
            renderPlayers(gameObject);
            renderPlayerCount(gameObject);
        })
        .catch(error => console.error(error));
}

export {loadLobbyInformation};
