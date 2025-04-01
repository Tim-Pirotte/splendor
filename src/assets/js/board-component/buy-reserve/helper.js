import {setActionButtonState} from "../game-status-interface.js";

function getReserveCardButton() {
    return document.querySelector(".reserve-button");
}

function finishRoundAfterBuyReserve() {
    getReserveCardButton().classList.add("hidden");

}

export { getReserveCardButton, finishRoundAfterBuyReserve };