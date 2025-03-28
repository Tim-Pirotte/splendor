import {takeTwoGemsRequest} from "./request-handler.js";
import {setActionButtonState} from "../game-status-interface.js";
import {MIN_TOKENS_FOR_PICKING_TWO} from "./config.js";
import {deleteFromStorage} from "../../data-connector/local-storage-abstractor.js";


function canGetToken(tokenType, amount) {
    return tokenType !== "Gold" && amount >= MIN_TOKENS_FOR_PICKING_TWO;
}

function selectToken(e) {
    deleteFromStorage("paymentMethod");

    const $selectedToken = e.target.closest("li");
    const tokenType = $selectedToken.dataset.type;

    if (canGetToken(tokenType, $selectedToken.dataset.amount)) {
        setActionButtonState("Take two", "processTakeTokenClick", {type: tokenType});
    }
}

function processTakeTokenClick(e) {
    const $actionButton = document.querySelector(".action-button");
    takeTwoGemsRequest($actionButton.dataset.type);
}

function updateTokens(res) {
    const beginIndexAmountText = 1;
    const endIndexAmountText = 3;

    for (const [token, taken] of Object.entries(res["tokens"])) {
     const $token = document.querySelector(`.board-tokens [data-type="${token}"]`);
     $token.dataset.amount = parseInt($token.dataset.amount) - parseInt(taken);
     const $amountText = $token.querySelector("p");
     $amountText.textContent = `${$token.dataset.amount}${$amountText.textContent.substring(beginIndexAmountText, endIndexAmountText)}`;
    }
}

export {selectToken, processTakeTokenClick, updateTokens};
