import * as API from "../api.js";
import { POLLING_TIME_OUT } from "../config.js";
import { hasGameStarted } from "../utils/game-object-handler.js";
import { renderGameInfo, renderPlayerCount, renderPlayersList } from "./renderer.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function loadLobbyInformation() {
    API.getGame().then(gameObject => {
        if (hasGameStarted(gameObject)) {
            location.href = "./board.html";
        } else {
            renderGameInfo(gameObject);
            renderPlayersList(gameObject);
            renderPlayerCount(gameObject);
            setTimeout(loadLobbyInformation, POLLING_TIME_OUT);
        }
    });
}
function copyGameId(){
    const gameId = loadFromStorage("gameId");
    navigator.clipboard.writeText(gameId);
}
export { loadLobbyInformation , copyGameId };
