import {getCurrentPlayer, setActionButtonState} from "../game-status-interface.js";
import {loadFromStorage, saveToStorage} from "../../data-connector/local-storage-abstractor.js";
import {renderSwitchPaymentButtons} from "../renderer/current-player-renderer.js";

function selectCard(e) {
    const card = getCard(e)
    if (card && canBuy(card)) {
        setActionButtonState(
        "buy",
        "processBuyCardClick",
        {level: card.dataset.level, index: card.dataset.index},
        )
        const defaultPayment = getDefaultPayment(getCardData(card)["cost"]);
        renderSwitchPaymentButtons(defaultPayment, getCardData(card)["cost"]);
        saveToStorage("paymentMethod", JSON.stringify(defaultPayment));
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

function getDefaultPayment(cost) {
    const currentPlayer = getCurrentPlayer();
    const tokens = currentPlayer["tokens"];
    const bonuses = currentPlayer["bonuses"];
    removeBonusesFromCost(cost, bonuses);
    return calculateDefaultPayment(cost, tokens)
}

function removeBonusesFromCost(cost, bonuses) {
    for (const tokenType in cost) {
        cost[tokenType] -= bonuses[tokenType] || 0;
    }
}

function calculateDefaultPayment(cost, tokens, card) {
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

function isAllowedToSwitchToken(tokenType, currentPayment, cost, wallet) {
    if (tokenType === "Gold") {
        return !((currentPayment["Gold"] || 0) === 0);
    } else if ((currentPayment["Gold"] || 0) === (wallet["Gold"] || 0)) {
        return false
    } else if (!(cost.hasOwnProperty(tokenType))) {
        return false;
    } else{
        return (currentPayment[tokenType] || 0)!==0;
    }
}

function handlePaymentMethodChange(e) {
    if (e.target.classList.contains("switch-token")) {
        const token = e.target.dataset.type;
        const card = getSelectedCardFromBuyButton();
        if (token === "Gold") {
            resetPayment(card);
        }
    }
}

function getSelectedCardFromBuyButton() {
    const $buyButton = document.querySelector(".action-button");
    return loadFromStorage("gameData")["market"][parseInt($buyButton.dataset.level) - 1]["visibleCards"][$buyButton.dataset.index];
}

function resetPayment(card){
    const defaultPayment = getDefaultPayment(getCardData(card)["cost"]);
    renderSwitchPaymentButtons(defaultPayment, getCardData(card)["cost"]);
    saveToStorage("paymentMethod", JSON.stringify(defaultPayment));
}

export {selectCard, processBuyCardClick, isAllowedToSwitchToken, getPlayerWallet, handlePaymentMethodChange};