import {GOLD_TOKEN_LIMIT, TOKEN_LIMIT, TOKEN_LIMIT_THREE_PLAYERS, TOKEN_LIMIT_TWO_PLAYERS} from "./config";

function setActionButton(message, tokenType, action) {
    const $actionButton = document.querySelector(".action-button");
    $actionButton.textContent = message;
    $actionButton.dataset.type = tokenType;
    $actionButton.dataset.action = action;
}

function getMaxTokens(playerLength, tokenType) {
    const twoPlayers = 2;
    const threePlayers = 3;

    if (tokenType === "Gold") return GOLD_TOKEN_LIMIT;

    if (playerLength === twoPlayers) {
        return TOKEN_LIMIT_TWO_PLAYERS;
    } else if (playerLength === threePlayers) {
        return TOKEN_LIMIT_THREE_PLAYERS;
    } else {
        return TOKEN_LIMIT;
    }
}

export {setActionButton, getMaxTokens};