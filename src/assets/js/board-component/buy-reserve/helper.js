import {clearDatasetAttributes, getActionButton, setActionButtonState} from "../game-status-interface.js";
import { unHighlightCards } from "./buy-handler.js";

function getReserveCardButton() {
    return document.querySelector(".reserve-button");
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

export { getReserveCardButton, endBuyReserveAction };
