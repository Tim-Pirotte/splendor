import {getCurrentPlayer, setActionButtonState} from "../game-status-interface.js";
import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";

function selectCard(e) {
    const card = getCard(e)
    if (card && canBuy(card)) {
        setActionButtonState(
        "buy",
        "processBuyCardClick",
        {level: card.dataset.level, index: card.dataset.index},
        )
        const exchangeableTokens = getExchangeableTokens(e);
        const defaultPayment = getDefaultPayment(getCardData(card)["cost"]);

    }
}

function canBuy(card) {
    const cost = getCardData(card)["cost"];
    const wallet = getPlayerWallet();
    return isWalletHigher(wallet, cost);
}

function getCard(e) {
    return e.target.closest(".card");
}

function processBuyCardClick() {
    const $actionButton = document.querySelector(".action-button");
    const cardData = getCardData($actionButton);
}

function getCardData($target) {
    const index = $target.dataset.index;
    const level = $target.dataset.level;
    return loadFromStorage("gameData")["market"][parseInt(level) - 1]["visibleCards"][index]
}

function getPlayerWallet() {
    const currentPlayer = getCurrentPlayer();
    const tokens = currentPlayer["tokens"];
    const bonuses = currentPlayer["bonuses"];

    for (const tokenType in bonuses) {
        if (tokens.hasOwnProperty(tokenType)) {
            tokens[tokenType] += bonuses[tokenType];
        } else {
            tokens[tokenType] = bonuses[tokenType];
        }
    }

    return tokens
}

function isWalletHigher(wallet, cost) {
    let minimumJokersNeeded = 0;
    for (const tokenType in cost) {
        const difference = cost[tokenType] - (wallet[tokenType] || 0);
        if (difference > 0) {
            minimumJokersNeeded += difference;
        }
    }

    return minimumJokersNeeded <= (wallet["Gold"] || 0);
}

function getExchangeableTokens(e) {
    return Object.keys(getCardData(getCard(e))["cost"]);
}

function getDefaultPayment(cost) {
    const currentPlayer = getCurrentPlayer();
    const tokens = currentPlayer["tokens"];
    const bonuses = currentPlayer["bonuses"];
    removeBonusesFromCost(cost, bonuses);
    const defaultPayment = calculateDefaultPayment(cost, tokens)
}

function removeBonusesFromCost(cost, bonuses) {
    for (const tokenType in cost) {
        cost[tokenType] -= bonuses[tokenType] || 0;
    }
}

function calculateDefaultPayment(cost, tokens) {
    const payment = {"Gold": 0};
    for (const tokenType in cost) {
        if (!tokens.hasOwnProperty(tokenType)) {
            payment[tokenType] = 0;
            payment["Gold"] += cost[tokenType];
        } else if (cost[tokenType] > (tokens[tokenType])) {
            payment[tokenType] = tokens[tokenType];
            payment["Gold"] += (cost[tokenType] - tokens[tokenType]);
        } else {
            payment[tokenType] = cost[tokenType];
        }
    }
    return payment;
}

export {selectCard, processBuyCardClick};