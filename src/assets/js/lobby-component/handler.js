import * as API from "../api.js";
import { COPY_BUTTON_REMOVE_FEEDBACK_DELAY, POLLING_TIME_OUT } from "../config.js";
import { hasGameStarted } from "../utils/game-object-handler.js";
import { renderGameInfo, renderPlayerCount, renderPlayersList, setCopyGameIdImageColor } from "./renderer.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { locateToMainMenu } from "../utils/data-handler.js";

function loadLobbyInformation() {
    if (!loadFromStorage("gameId")) {
        locateToMainMenu();
    }

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
    setCopyGameIdImageColor("red");
    const gameId = loadFromStorage("gameId");
    navigator.clipboard.writeText(gameId);
    setTimeout(setCopyGameIdImageColor, COPY_BUTTON_REMOVE_FEEDBACK_DELAY, "black");
}

export { loadLobbyInformation , copyGameId };
