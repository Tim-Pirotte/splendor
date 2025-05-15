import { processBuyCardClick } from "./buy-reserve/buy-handler.js";
import { processSkipTurn, processTakeTokensClick, processTakeTwoTokens } from "./tokens/token-handler.js";
import { processTakeNoble } from "./nobles/nobles-handler.js";
import { processDiscardTokens } from "./tokens/discard.js";
import {getActionButton, isCurrentlyPlaying} from "./game-status-interface.js";
import {getReserveCardButton} from "./buy-reserve/helper.js";
import * as API from "../api.js"

const ACTION_REGISTRY = {
    processTakeTokenClick: () => processTakeTokensClick(),
    processTakeTwoTokensClick: () => processTakeTwoTokens(),
    processBuyCardClick: () => processBuyCardClick(),
    skipTurn: () => processSkipTurn(),
    processTakeNoble: () => processTakeNoble(),
    processDiscardTokens: () => processDiscardTokens(),
    stopSpectating: () => API.leaveGame(),
    doNothing: () => {},
};

function handleKeyPress(e) {
    if (!isCurrentlyPlaying()) return;

    e.preventDefault();

    const activeElement = document.activeElement;

    if (e.key === "Enter") {
        clickOnSelectedButton(activeElement);
        return;
    }

    if (e.key === "Tab") focusOtherButton(activeElement);
}

function clickOnSelectedButton(activeElement) {
    if (activeElement.classList.contains("action-button") || activeElement.classList.contains("reserve-button")) {
        activeElement.click();
        return;
    }

    getActionButton().disabled
        ? getReserveCardButton().click()
        : getActionButton().click();
}

function focusOtherButton(activeElement) {
    activeElement.classList.contains("action-button")
        ? getReserveCardButton().focus()
        : getActionButton().focus();
}

export { ACTION_REGISTRY, handleKeyPress };
