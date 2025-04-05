import * as API from "../api.js";
import { renderPage } from "./renderer/renderer.js";
import { initRoundBegin, saveGameState } from "./state-machine/state-machine.js";
import { isCurrentlyPlaying } from "./game-status-interface.js";
import { POLLING_TIME_OUT } from "../config.js";
import { processSkipTurn } from "./tokens/token-handler.js";
import { SECONDS_PER_ROUND, SECONDS_WHEN_TURN_ALMOST_ENDS } from "./config.js";
import { loadFromStorage, saveToStorage } from "../data-connector/local-storage-abstractor.js";

function handleGameDataError(err) {
    const forbidden = 403;
    const unauthorized = 401;
    const statusCode = err["failure"];

    if (statusCode === forbidden || statusCode === unauthorized) {
        location.href = "../index.html";
    }

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

/* https://www.freecodecamp.org/news/javascript-timer-how-to-set-a-timer-function-in-js/ */
function startRoundTimer() {
    const $progressBarFill = document.querySelector(".timer-fill");

    $progressBarFill.classList.remove("time-almost-ends");
    $progressBarFill.style.height = "100%";
    // This forces the browser to register the height
    // NOSONAR_BEGIN
    $progressBarFill.offsetHeight;
    // NOSONAR_END

    const $progressBar = document.querySelector(".timer");

    // TODO : fill with server data!
    // "2025-04-01T19:45:00.000Z"
    const timeRoundStarted = new Date(Date.now()).getTime();

    const timer = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = Math.floor((currentTime - timeRoundStarted) / 1000);

        $progressBarFill.style.height = `${(SECONDS_PER_ROUND - 2 - deltaTime) / (SECONDS_PER_ROUND - 2) * 100}%`;
        $progressBar.setAttribute("aria-valuenow", SECONDS_PER_ROUND - deltaTime);

        if (deltaTime >= SECONDS_PER_ROUND - SECONDS_WHEN_TURN_ALMOST_ENDS) {
            $progressBarFill.classList.add("time-almost-ends");
        }

        if (deltaTime >= SECONDS_PER_ROUND) {
            clearInterval(timer);

            processSkipTurn();
            startGameStatePolling();
            updateGameData();
        }
    }, 1000);
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
