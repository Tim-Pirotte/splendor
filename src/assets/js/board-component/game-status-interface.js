import { startGameStatePolling } from "./game-data-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { ACTION_REGISTRY } from "./action-registry.js";
import {getReserveCardButton} from "./buy-reserve/helper.js";
import {unHighlightTokens} from "./tokens/token-handler.js";
import {deselectCard} from "./buy-reserve/select.js";

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

function clearDatasetAttributes($target) {
    for (const datasetAttribute in $target.dataset) {
        delete $target.dataset[datasetAttribute];
    }
}

function actionRegistryRouter() {
    resetCurrentPlayer();
    const $actionButton = getActionButton();

    ACTION_REGISTRY[$actionButton.dataset.functionToRun]();
    setActionButtonState("Waiting on server", "doNothing", {});
    getActionButton().disabled = true;
    startGameStatePolling();
}

function initGameStatusInterface() {
    const $actionButton = getActionButton();
    $actionButton.addEventListener("click", actionRegistryRouter);
}

function resetCurrentPlayer() {
    document.querySelector("body").classList.remove("client-player-turn");
}

function deselectAll() {
    clearDatasetAttributes(getReserveCardButton());
    unHighlightTokens();
    deselectCard();
    getReserveCardButton().classList.add('hidden');
    setActionButtonState("skip turn", "skipTurn", {}, true);
    getActionButton().disabled = false;
}

export {
    isCurrentlyPlaying,
    initGameStatusInterface,
    setActionButtonState,
    getActionButton,
    clearDatasetAttributes,
    resetCurrentPlayer,
    deselectAll,
};
