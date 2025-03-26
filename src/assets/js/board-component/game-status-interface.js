import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {ACTION_REGISTRY} from "./action-registry.js";

function isCurrentlyPlaying() {
  const playerName = loadFromStorage("playerName");
  const currentlyPlaying = loadFromStorage("gameData")["currentPlayer"];
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
  const $actionButton = document.querySelector(".action-button");
  $actionButton.textContent = message;
  $actionButton.dataset.functionToRun = functionToRunOnClick;

  for (const [name, value] of Object.entries(datasetParameters)) {
    $actionButton.dataset[name] = value.toString();
  }
}

function actionRegistryRouter() {
  const $actionButton = document.querySelector(".action-button");
  ACTION_REGISTRY[$actionButton.dataset.functionToRun]();
}

function initGameStatusInterface() {
  const $actionButton = document.querySelector(".action-button");
  $actionButton.addEventListener("click", actionRegistryRouter);
}

export {isCurrentlyPlaying, initGameStatusInterface, setActionButtonState, getGameCreator};