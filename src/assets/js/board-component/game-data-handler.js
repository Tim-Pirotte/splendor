import { POLLING_TIME_OUT } from "../config.js";
import { SECONDS_PER_ROUND, SECONDS_WHEN_TURN_ALMOST_ENDS } from "./config.js";
import * as API from "../api.js";
import { renderPage } from "./renderer/renderer.js";
import { getActionButton, isCurrentlyPlaying } from "./game-status-interface.js";
import {initRoundBegin, saveCurrentPlayerAndGameStateInDom, saveGameState} from "./state-machine/state-machine.js";
import { loadFromStorage, saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { processSkipTurn } from "./tokens/token-handler.js";
import { locateToMainMenu } from "../utils/data-handler.js";

function handleGameDataError(err) {
    const forbidden = 403;
    const unauthorized = 401;
    const gameNotExists = 404;
    const statusCode = err["failure"];

    if (statusCode === forbidden || statusCode === unauthorized || statusCode === gameNotExists) locateToMainMenu();
    console.error(err);
}

function updateGameData() {
    const gameId = loadFromStorage("gameId");

    if (gameId === null) {locateToMainMenu(); return;}

    API.getGame().then(gameData => {
        if (!gameData.started) {location.href = "./lobby.html"; return;}

        saveToStorage("gameData", gameData);
        saveGameState(gameData["gameState"]);
        saveCurrentPlayerAndGameStateInDom(gameData)
        renderPage(gameData);
        initRoundBegin(gameData);

        if (!isCurrentlyPlaying()) {
            startGameStatePolling();
        } else {
            startRoundTimer();
        }
    }).catch(err => handleGameDataError(err));
}

function startGameStatePolling() {
    setTimeout(updateGameData, POLLING_TIME_OUT);
}

/* https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
The reason for the timer being implemented this way and not with setTimeOut and a css transition goes as follows:
 - setTimeOut doesn't ensure that it runs exactly at the specified time
 - The execution time of the update function would have to also be subtracted from the delay
 - The execution order between js and css can differ which can make the timer bar go back and forth
 - Page inactivity can halt the execution of a timed out function in certain browsers
*/
function setTimer(duration, $timerFill) {
    const startTime = Date.now();

    function update() {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        const remaining = Math.max(0, duration - elapsed);

        const percent = (remaining / duration) * 100;
        $timerFill.style.height = `${percent}%`;
        $timerFill.closest(".timer").setAttribute("aria-valuenow", Math.floor(remaining));

        $timerFill.classList.toggle("time-almost-ends", remaining < SECONDS_WHEN_TURN_ALMOST_ENDS);

        if (!isCurrentlyPlaying()) return;

        if (remaining > 0) {
            requestAnimationFrame(update);
        } else if (!getActionButton().disabled) {
            getActionButton().click();
        } else {
            processSkipTurn();
        }
    }

    requestAnimationFrame(update);
}

function startRoundTimer() {
    const $timerFill = document.querySelector(".timer-fill");
    $timerFill.classList.remove("time-almost-ends");
    setTimer(SECONDS_PER_ROUND, $timerFill);
}

function getClientTokens() {
    const tokens = {};

    for (const $token of document.querySelectorAll(".player-tokens ul > li")) {
        tokens[$token.dataset.type] = parseInt($token.dataset.amount);
    }

    return tokens;
}

function getClientBonuses() {
    const bonuses = {};

    for (const $bonus of document.querySelectorAll(".player-tokens ul > li")) {
        bonuses[$bonus.dataset.type] = parseInt($bonus.dataset.bonuses) || 0;
    }

    return bonuses;
}

function getClientTotalPrestigePoints() {
    return parseInt(document.querySelector(".player-points h4").dataset.totalPrestigePoints);
}

export { updateGameData, getClientTokens, getClientBonuses, getClientTotalPrestigePoints, startGameStatePolling };
