import {setActionButton} from "../helper.js";
import {takeTwoGemsRequest} from "./request-handler.js";


function canGetToken(tokenType, amount) {
    return tokenType !== "Gold" && amount >= 4;
}

function selectToken(e) {
    const $selectedToken = e.target.closest("li");
    const tokenType = $selectedToken.dataset.type;

    if (canGetToken(tokenType, $selectedToken.dataset.amount)) {
        setActionButton("Take two", tokenType, "takeTokens");
    }
}

function processTakeTokenClick(e) {
    const $actionButton = document.querySelector(".action-button");

    if ($actionButton.dataset.action === "takeTokens") {
        takeTwoGemsRequest($actionButton.dataset.type);
    }
}

function updateTokens(res) {
    for (const [token, amount] of Object.entries(res["tokens"])) {
     const $token = document.querySelector(`[data-type="${token}"]`);
     $token.dataset.amount -= amount;
     const $amountText = $token.querySelector("p");
     $amountText.textContent = `${$token.dataset.amount}${$amountText.textContent.substring(1, 3)}`;
    }
}

export {selectToken, processTakeTokenClick, updateTokens};
