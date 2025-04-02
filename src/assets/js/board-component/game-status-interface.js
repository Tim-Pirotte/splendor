import { startGameStatePolling } from "./game-data-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { ACTION_REGISTRY } from "./action-registry.js";

function isCurrentlyPlaying() {
    const playerName = loadFromStorage("playerName");
    const currentlyPlaying = document.querySelector(".top-bar h1").dataset.currentlyPlaying;
    return playerName === currentlyPlaying;
}

function getActionButton() {
    return document.querySelector(".action-button");
}

function setActionButtonState(message, functionToRunOnClick, datasetParameters, reset = true) {
    const $actionButton = getActionButton();

    if (reset) {
        clearDatasetAttributes(getActionButton());
    }

    $actionButton.textContent = message;
    $actionButton.dataset.functionToRun = functionToRunOnClick;

    setActionButtonDataset(datasetParameters, $actionButton);
}

function setActionButtonDataset(datasetParameters, $actionButton) {
    for (const [name, value] of Object.entries(datasetParameters)) {
        $actionButton.dataset[name] = value.toString();
    }
}

function clearDatasetAttributes($actionButton) {
    for (const datasetAttribute of Object.keys($actionButton.dataset)) {
        $actionButton.removeAttribute(`data-${datasetAttribute}`);
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

export { isCurrentlyPlaying, initGameStatusInterface, setActionButtonState, getActionButton, clearDatasetAttributes };
