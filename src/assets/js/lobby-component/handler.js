import * as API from "../api.js";
import { COPY_BUTTON_REMOVE_FEEDBACK_DELAY, IN_GAME_POLLING_TIME_OUT, LOBBY_COUNTDOWN_DURATION } from "../config.js";
import {
    renderGameInfo,
    renderGameStartingCountdown, renderLobbyPlayers,
    renderPlayerCount,
    setCopyGameIdImageColor,
} from "./renderer.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { locateToMainMenu } from "../utils/data-handler.js";
import { checkCompatibility } from "../server-version-component/server-version.js";

function loadLobbyInformation(startedByPolling) {
    if (!loadFromStorage("gameId")) {
        locateToMainMenu();
    }

    API.getGame(loadLobbyInformation).then(gameData => {
        renderGameInfo(gameData, gameData.started);
        renderLobbyPlayers(gameData, gameData.started);
        renderPlayerCount(gameData);
        hideIncompatibleElements();
        if (gameData.started) {
            const $countdownContainer = document.createElement("li");
            $countdownContainer.classList.add("starting-countdown");

            document.querySelector("ul").insertAdjacentElement("beforeend", $countdownContainer);

            renderGameStartingCountdown(LOBBY_COUNTDOWN_DURATION, $countdownContainer);
        } else {
            setTimeout(loadLobbyInformation, IN_GAME_POLLING_TIME_OUT);
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

function processAddBot(e) {
    const $clickedListItem = e.target.closest("li");

    if (!e.target.closest("button")) return;
    if (!$clickedListItem?.classList.contains("add-bot")) return;

    const selectedLevel = $clickedListItem.querySelector("select").value;

    API.joinBot(selectedLevel);
    loadLobbyInformation(false);
}

export { loadLobbyInformation , copyGameId, processAddBot };
