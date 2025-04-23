import { clearDatasetAttributes, getActionButton, setActionButtonState } from "../game-status-interface.js";
import { unHighlightCards } from "./buy-handler.js";

function getReserveCardButton() {
    return document.querySelector(".reserve-button");
}

function setReserveButtonData($card, deckLevel) {
    if (deckLevel) {
        getReserveCardButton().dataset.level = deckLevel;
    } else {
        getReserveCardButton().dataset.name = $card.dataset.name;
    }
}

function endBuyReserveAction() {
    const $actionButton = getActionButton();
    const $reserveButton = getReserveCardButton();

    $actionButton.disabled = true;
    $reserveButton.classList.add("hidden");
    clearDatasetAttributes($reserveButton);
    unHighlightCards();
    setActionButtonState("Waiting on server", "doNothing", {});
}

export { getReserveCardButton, endBuyReserveAction, setReserveButtonData };
