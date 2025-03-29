import * as API from "../api.js";
import { loadFromStorage, saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderPage } from "./renderer/renderer.js";
import { initRoundBegin } from "./state-machine/state-machine.js";
import {getClientPlayer, isCurrentlyPlaying} from "./game-status-interface.js";
import {POLLING_TIME_OUT} from "../config.js";

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
      initRoundBegin(gameData);
      renderPage(gameData);

      if (!isCurrentlyPlaying()) {
        startGameStatePolling();
      }
    })
    .catch(err => handleGameDataError(err));
}

function startGameStatePolling() {
  setTimeout(updateGameData, POLLING_TIME_OUT);
}

function getGems() {
  API.getGemsList().then(gems => saveToStorage("gems", gems["gems"]));
}

function waitOnTokenData() {
  return loadFromStorage("gems");
}

export {updateGameData, getGems, waitOnTokenData, startGameStatePolling};