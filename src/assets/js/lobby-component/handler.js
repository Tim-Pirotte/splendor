import {hasGameStarted} from "../utils/game-object-handler.js";
import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { renderHeader, renderPlayerCount, renderPlayers } from "./renderer.js";
import {POLLING_TIME_OUT} from "../config.js";

function loadLobbyInformation() {
    fetchFromServer(`/games/${loadFromStorage("gameId")}`)
        .then(gameObject => {
            if (!hasGameStarted(gameObject)) {
                renderHeader(gameObject);
                renderPlayers(gameObject);
                renderPlayerCount(gameObject);
                startPolling();
            } else {
                location.href = `./board.html`;
            }
        });
}

function startPolling() {
  setTimeout(loadLobbyInformation, POLLING_TIME_OUT);
}

export { loadLobbyInformation };
