import { startGameStatePolling } from "./game-data-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { ACTION_REGISTRY } from "./action-registry.js";
import { getActionButton } from "./helper.js";

function isCurrentlyPlaying() {
  const playerName = loadFromStorage("playerName");
  const currentlyPlaying = document.querySelector(".top-bar h2").dataset.currentlyPlaying;
  return playerName === currentlyPlaying;
}

function getCurrentPlayer() {
  const players = loadFromStorage("gameData")["players"];
  const playerName = loadFromStorage("playerName");

  for (const player of players) {
    if (player["name"] === playerName) {
      return player;
    }
  }
}

function getGameCreator() {
  return loadFromStorage("gameData")["players"][0];
}

function hasGameStarted() {
  return !("started" in loadFromStorage("gameData"));
}

function getGameState() {
  return loadFromStorage("gameData")["gameState"];
}

function setActionButtonState(message, functionToRunOnClick, datasetParameters) {
  const $actionButton = getActionButton();
  $actionButton.textContent = message;
  $actionButton.dataset.functionToRun = functionToRunOnClick;

  for (const [name, value] of Object.entries(datasetParameters)) {
    $actionButton.dataset[name] = value.toString();
  }
}

function actionRegistryRouter() {
  const $actionButton = getActionButton();
  ACTION_REGISTRY[$actionButton.dataset.functionToRun]();
  startGameStatePolling();
}

function initGameStatusInterface() {
  const $actionButton = getActionButton();
  $actionButton.addEventListener("click", actionRegistryRouter);
}

export { isCurrentlyPlaying, initGameStatusInterface, setActionButtonState, getGameCreator, getCurrentPlayer };
