import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {renderPage} from "./renderer/renderer.js";

function handleGameDataError(err) {
  console.log(err);
  const statusCode = err["failure"];
  if (statusCode === 403 || statusCode === 401) {
    location.href = "../index.html";
  }
}

function updateGameData() {
  const gameId = loadFromStorage("gameId");
  if (gameId === null) location.href = "../index.html";
  fetchFromServer(`/games/${gameId}`)
    .then(gameData => renderPage(gameData))
    .catch(err => handleGameDataError(err));
}

export {updateGameData};