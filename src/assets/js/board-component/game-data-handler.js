import { POLLING_TIME_OUT } from "../config.js";
import { SECONDS_PER_ROUND, SECONDS_WHEN_TURN_ALMOST_ENDS } from "./config.js";
import * as API from "../api.js";
import { renderPage } from "./renderer/renderer.js";
import { getActionButton, isCurrentlyPlaying } from "./game-status-interface.js";
import { initRoundBegin, saveGameState } from "./state-machine/state-machine.js";
import { loadFromStorage, saveToStorage } from "../data-connector/local-storage-abstractor.js";

function handleGameDataError(err) {
    const forbidden = 403;
    const unauthorized = 401;
    const gameNotExists = 404;
    const statusCode = err["failure"];

    if (statusCode === forbidden || statusCode === unauthorized || statusCode === gameNotExists) location.href = "../index.html";
    console.error(err);
}

function updateGameData() {
    const gameId = loadFromStorage("gameId");

    if (gameId === null) location.href = "../index.html";

    API.getGame().then(gameData => {
        saveToStorage("gameData", gameData);
        saveGameState(gameData["gameState"]);
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

function setTimer(currentSeconds, maxSeconds, $timerFill) {
    if (isCurrentlyPlaying()) {
        const timerHeight = currentSeconds / maxSeconds * 100;
        $timerFill.style.height = `${timerHeight}%`;
        $timerFill.closest(".timer").setAttribute("aria-valuenow", currentSeconds);

        $timerFill.classList.toggle("time-almost-ends", currentSeconds < SECONDS_WHEN_TURN_ALMOST_ENDS);

        if (currentSeconds > 0) {
            setTimeout(() => setTimer(currentSeconds - 1, maxSeconds, $timerFill), 1000);
        } else if (getActionButton().disabled) {
            getActionButton().click();
        } else {
            processSkipTurn();
        }
    }
}

function startRoundTimer() {
    setTimer(SECONDS_PER_ROUND - 1, SECONDS_PER_ROUND - 1, document.querySelector(".timer-fill"));
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
    return parseInt(document.querySelector(".player-points p").dataset.totalPrestigePoints);
}

export { updateGameData, getClientTokens, getClientBonuses, getClientTotalPrestigePoints, startGameStatePolling };
