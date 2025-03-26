import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {renderHeader, renderPlayers} from "./renderer.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";

function loadHeader() {
    fetchFromServer(`/games/${loadFromStorage("gameId")}`, `GET`)
        .then(gameObject => renderHeader(gameObject))
        .catch(error => console.error(error));
}

function loadPlayers() {
    fetchFromServer(`/games/${loadFromStorage("gameId")}`, `GET`)
        .then(gameObject => renderPlayers(gameObject))
        .catch(error => console.error(error));
}

export {loadHeader, loadPlayers};
