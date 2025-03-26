import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {renderPage} from "./renderer/renderer.js";

function handleGameDataError(err) {
  const statusCode = err["failure"];

  if (statusCode === 403 || statusCode === 401) {
    location.href = "../index.html";
  }
}

function updateGameData() {
  const gameId = loadFromStorage("gameId");
  if (gameId === null) location.href = "../index.html";

  fetchFromServer(`/games/${gameId}`)
    .then(gameData => {
      saveToStorage("gameData", gameData);
      renderPage(gameData);
    })
    .catch(err => handleGameDataError(err));
}

function getGems() {
  fetchFromServer("/gems").then(gems => saveToStorage("gems", gems["gems"]));
}

function waitOnTokenData() {
  while(loadFromStorage("gems") === null) {}
  return loadFromStorage("gems");
}

export {updateGameData, getGems, waitOnTokenData};