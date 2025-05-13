import { processBuyCardClick } from "./buy-reserve/buy-handler.js";
import { processSkipTurn, processTakeTokensClick, processTakeTwoTokens } from "./tokens/token-handler.js";
import { processTakeNoble } from "./nobles/nobles-handler.js";
import { processDiscardTokens } from "./tokens/discard.js";
import { stopSpectating } from "../join-game-component/spectate.js";
import {getActionButton} from "./game-status-interface.js";
import {getReserveCardButton} from "./buy-reserve/helper.js";

const ACTION_REGISTRY = {
    processTakeTokenClick: () => processTakeTokensClick(),
    processTakeTwoTokensClick: () => processTakeTwoTokens(),
    processBuyCardClick: () => processBuyCardClick(),
    skipTurn: () => processSkipTurn(),
    processTakeNoble: () => processTakeNoble(),
    processDiscardTokens: () => processDiscardTokens(),
    stopSpectating: () => stopSpectating(),
    doNothing: () => {},
};

function handleKeyPress(e) {
    const activeElement = document.activeElement;
    if (e.key === "Enter") {
        if (!(activeElement.classList.contains("action-button") || activeElement.classList.contains("reserve-button"))) {
            getActionButton().click();
        } else {
            activeElement.click();
        }

        return;
    }

    if (e.key === "Tab") {
        e.preventDefault();
        if(activeElement.classList.contains("action-button")) {
            getReserveCardButton().focus()
        } else {
            getActionButton().focus();
        }
    }
}

export { ACTION_REGISTRY, handleKeyPress };
