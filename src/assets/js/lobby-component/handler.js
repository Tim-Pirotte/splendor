import * as API from "../api.js";
import { COPY_BUTTON_REMOVE_FEEDBACK_DELAY, POLLING_TIME_OUT } from "../config.js";
import {
    renderGameInfo,
    renderGameStartingCountdown,
    renderPlayerCount,
    renderPlayersList,
    setCopyGameIdImageColor
} from "./renderer.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { locateToMainMenu } from "../utils/data-handler.js";
import { checkCompatibility } from "../server-version-component/server-version.js";

function loadLobbyInformation() {
    if (!loadFromStorage("gameId")) {
        locateToMainMenu();
    }

    API.getGame().then(gameData => {
        renderGameInfo(gameData, gameData.started);
        renderPlayersList(gameData, gameData.started);
        renderPlayerCount(gameData);
        hideIncompatibleElements();
        if (gameData.started) {
            const $countdownContainer = document.createElement("li");
            $countdownContainer.classList.add("starting-countdown")

            document.querySelector("ul").insertAdjacentElement("beforeend", $countdownContainer);

            renderGameStartingCountdown(3, $countdownContainer);
        } else {
            setTimeout(loadLobbyInformation, POLLING_TIME_OUT);
        }
    });
}

function copyGameId(){
    setCopyGameIdImageColor("red");
    const gameId = loadFromStorage("gameId");
    navigator.clipboard.writeText(gameId);
    setTimeout(setCopyGameIdImageColor, COPY_BUTTON_REMOVE_FEEDBACK_DELAY, "white");
}

function hideIncompatibleElements() {
    checkCompatibility(2).then(isCompatible => {
        if (!isCompatible) document.querySelector(".leave-button").classList.add("none");
    });
}
export { loadLobbyInformation , copyGameId };
