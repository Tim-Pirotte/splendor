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
    for (const [token, amount] of res["tokens"]) {
     const $token = document.querySelector(`[data-type="${token}"]`);
     $token.dataset.amount = amount;
     $token.querySelector("p").textContent = `${amount}/${}`;
    }
    return console.log(res);
}

export {selectToken, processTakeTokenClick, updateTokens};
