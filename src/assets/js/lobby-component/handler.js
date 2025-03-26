import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {renderHeader, renderPlayerCount, renderPlayers} from "./renderer.js";
import {hasGameStarted} from "../general-logic/object-handler.js";

function loadLobbyInformation() {
    fetchFromServer(`/games/${loadFromStorage("gameId")}`, `GET`)
        .then(gameObject => {
            if (!hasGameStarted(gameObject)) {
                renderHeader(gameObject);
                renderPlayers(gameObject);
                renderPlayerCount(gameObject);
            } else {
                window.location.href = `./board.html`;
            }
        })
        .catch(error => console.error(error));
}

export {loadLobbyInformation};
