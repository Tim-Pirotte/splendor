import {getActionButton, setActionButtonState} from "../game-status-interface.js";
import {unHighlightCards} from "./buy-handler.js";

function getReserveCardButton() {
    return document.querySelector(".reserve-button");
}

function endBuyReserveAction() {
    unHighlightCards();
    getReserveCardButton().classList.add("hidden");
    setActionButtonState("Waiting on server", "doNothing", {});
    getActionButton().disabled = true;
}

export { getReserveCardButton, endBuyReserveAction };
