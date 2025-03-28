import * as API from "../api.js";
import { hasGameStarted } from "../utils/game-object-handler.js";
import { renderHeader, renderPlayerCount, renderPlayers } from "./renderer.js";
import {POLLING_TIME_OUT} from "../config.js";

function loadLobbyInformation() {
    API.getGame().then(gameObject => updateLobby(gameObject));
}

function updateLobby(gameObject) {
    if (!hasGameStarted(gameObject)) {
        renderHeader(gameObject);
        renderPlayers(gameObject);
        renderPlayerCount(gameObject);
        startPolling();
    } else {
        location.href = `./board.html`;
    }
}

function startPolling() {
  setTimeout(loadLobbyInformation, POLLING_TIME_OUT);
}

export { loadLobbyInformation };
