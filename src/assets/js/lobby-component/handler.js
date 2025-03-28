import * as API from "../api.js";
import { hasGameStarted } from "../utils/game-object-handler.js";
import { renderHeader, renderPlayerCount, renderPlayers } from "./renderer.js";

function loadLobbyInformation() {
    API.getGame()
        .then(gameObject => updateLobby(gameObject));
}

function updateLobby(gameObject) {
    if (!hasGameStarted(gameObject)) {
        renderHeader(gameObject);
        renderPlayers(gameObject);
        renderPlayerCount(gameObject);
    } else {
        location.href = `./board.html`;
    }
}

export { loadLobbyInformation };
