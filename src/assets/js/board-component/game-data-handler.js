import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {renderPage} from "./renderer/renderer.js";

function updateGameData() {
  const gameId = loadFromStorage("GameId");
  if (gameId === null) {}
  fetchFromServer(`/games/${gameId}`).then(res => res.json()).then(res => renderPage(res));
}

export {updateGameData};