import * as API from "../api.js";
import { deleteFromStorage, loadFromStorage, saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderPage } from "./renderer/renderer.js";
import { initRoundBegin } from "./state-machine/state-machine.js";
import { isCurrentlyPlaying } from "./game-status-interface.js";
import { POLLING_TIME_OUT } from "../config.js";
import {processSkipTurn} from "./token/token-handler.js";

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
        renderPage(gameData);
        initRoundBegin(gameData);

        if (!isCurrentlyPlaying()) {
            startGameStatePolling();
        } else {
            startRoundTimer();
        } })
        .catch(err => handleGameDataError(err));
}

function startGameStatePolling() {
    setTimeout(updateGameData, POLLING_TIME_OUT);
}

/* https://www.freecodecamp.org/news/javascript-timer-how-to-set-a-timer-function-in-js/ */
function startRoundTimer() {
    const progressBar = document.querySelector("#roundTimer");
    let roundTime = loadFromStorage("roundTime") || 45;

    let timer = setInterval(function () {
        roundTime--;
        progressBar.value = roundTime;

        saveToStorage("roundTime", roundTime);

        if (roundTime <= 0) {
            deleteFromStorage("roundTime");
            clearInterval(timer);
            processSkipTurn();
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
        bonuses[$bonus.dataset.type] = parseInt($bonus.dataset.bonuses);
    }

    return bonuses;
}

function getClientTotalPrestigePoints() {
    return parseInt(document.querySelector(".player-points p").dataset.totalPrestigePoints);
}

export { updateGameData, getClientTokens, getClientBonuses, getClientTotalPrestigePoints, startGameStatePolling };
