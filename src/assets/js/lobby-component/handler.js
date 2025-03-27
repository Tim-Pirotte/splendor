import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { renderHeader, renderPlayerCount, renderPlayers } from "./renderer.js";
import { hasGameStarted } from "../general-logic/object-handler.js";

function loadLobbyInformation() {
    fetchFromServer(`/games/${loadFromStorage("gameId")}`, `GET`)
        .then(gameObject => {
            if (!hasGameStarted(gameObject)) {
                renderHeader(gameObject);
                renderPlayers(gameObject);
                renderPlayerCount(gameObject);
            } else {
                location.href = `./board.html`;
            }
        });
}

export { loadLobbyInformation };
