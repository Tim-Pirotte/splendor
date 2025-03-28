import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {renderPage} from "./renderer/renderer.js";
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

  fetchFromServer(`/games/${gameId}`)
    .then(gameData => {
      saveToStorage("gameData", gameData);
      renderPage(gameData);
      setTimeout(updateGameData, POLLING_TIME_OUT);
    })
    .catch(err => handleGameDataError(err));
}

function getGems() {
  fetchFromServer("/gems").then(gems => saveToStorage("gems", gems["gems"]));
}

function waitOnTokenData() {
  return loadFromStorage("gems");
}

export {updateGameData, getGems, waitOnTokenData};