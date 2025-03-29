import * as API from "../../api.js";
import { getCurrentPlayer, setActionButtonState } from "../game-status-interface.js";
import {
    renderSwitchPaymentButtons, renderUpdatedPlayerScore, renderUpdatedPlayerTokens
} from "../renderer/current-player-renderer.js";
import { DEVELOPMENT_CARDS } from "../data.js";
import { renderUpdatedBoardTokens } from "../renderer/board-renderer.js";
import { getActionButton, mergeObjectsWithSum } from "../helper.js";

function selectCard(e) {
    const $card = getCard(e);

    setActionButtonState(
    "buy",
    "processBuyCardClick",
    {name: $card.dataset.name},
    );

    if ($card && canBuy($card)) {
        const cardData = getCardData($card.dataset.name);
        const defaultPayment = getDefaultPaymentMethod(cardData["cost"]);

        getActionButton().disabled = false;
        setNewPaymentMethod(defaultPayment);
        renderSwitchPaymentButtons(defaultPayment, cardData["cost"]);
    } else {
        getActionButton().disabled = true;
    }
}

function canBuy($card) {
    const cost = getCardData($card.dataset.name)["cost"];
    const wallet = getPlayerWallet();
    return isWalletHigher(wallet, cost);
}

function getCard(e) {
    return e.target.closest(".card");
}

function processBuyCardClick() {
    const $actionButton = getActionButton();
    const cardData = getCardData($actionButton.dataset.name);
    const requestBody =
    {development: {name: cardData["name"]}, payment: getCurrentPaymentMethod()};

    renderUpdatedPlayerTokens(cardData["bonus"]);
    renderUpdatedPlayerScore(cardData["prestigePoints"]);
    renderUpdatedBoardTokens(JSON.parse(sessionStorage.getItem("paymentMethod")));

    API.buyCard(requestBody).then(res => sessionStorage.removeItem("paymentMethod"));

}

function getCardData(cardName) {
    for (const card of DEVELOPMENT_CARDS) {
        if (card["name"] === cardName) {
            return card;
        }
    }
}

function getPlayerWallet() {
    const currentPlayer = getCurrentPlayer();
    const tokens = currentPlayer["tokens"];
    const bonuses = currentPlayer["bonuses"];

    return mergeObjectsWithSum(tokens, bonuses);
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

function getDefaultPaymentMethod(cost) {
    const currentPlayer = getCurrentPlayer();
    const tokens = currentPlayer["tokens"];
    const bonuses = currentPlayer["bonuses"];

    removeBonusesFromCost(cost, bonuses);

    return calculateDefaultPayment(cost, tokens);
}

function removeBonusesFromCost(cost, bonuses) {
    for (const tokenType in cost) {
        if (cost[tokenType] >= (bonuses[tokenType] || 0)) {
            cost[tokenType] -= bonuses[tokenType] || 0;
        } else {
            cost[tokenType] = 0;
        }
    }
}

function calculateDefaultPayment(cost, tokens) {
    const payment = {"Gold": 0};

    for (const [tokenType, amount] of Object.entries(cost)) {
        if (!(tokenType in tokens)) {
            payment[tokenType] = 0;
            payment["Gold"] += amount;
        } else if (amount > (tokens[tokenType])) {
            payment[tokenType] = tokens[tokenType];
            payment["Gold"] += (amount - tokens[tokenType]);
        } else {
            payment[tokenType] = amount;
        }
    }

    return payment;
}

function isAllowedToSwitchToken(tokenType, currentPayment, cost, tokensInWallet) {
    const goldInPayment = currentPayment["Gold"] || 0;

    if (tokenType === "Gold") {
        return (goldInPayment !== 0);
    } else if (goldInPayment === (tokensInWallet["Gold"] || 0)) {
        return false;
    } else if (!(tokenType in cost)) {
        return false;
    } else {
        return (currentPayment[tokenType]) > 0;
    }
}

function handlePaymentMethodChange(e) {
    if (e.target.classList.contains("switch-token")) {
        const tokenType = e.target.dataset.type;
        const cost = getCardData(document.querySelector(".action-button").dataset.name)["cost"];

        if (tokenType === "Gold") {
            resetPayment(cost);
        } else {
            updatePaymentMethod(tokenType, cost);
        }
    }
}

function resetPayment(cost){
    const paymentMethod = getDefaultPaymentMethod(cost);

    setNewPaymentMethod(paymentMethod);
    renderSwitchPaymentButtons(paymentMethod, cost);
}

function updatePaymentMethod(tokenType, cost) {
    const paymentMethod = getNewPaymentMethod(tokenType);

    setNewPaymentMethod(paymentMethod);
    renderSwitchPaymentButtons(paymentMethod, cost);
}

function getNewPaymentMethod(tokenType) {
    const paymentMethod = getCurrentPaymentMethod();

    paymentMethod["Gold"]++;
    paymentMethod[tokenType]--;

    return paymentMethod;
}

function removePaidTokens() {
    const wallet = getPlayerWallet();
    const tokensPaid = getCurrentPaymentMethod();

    for (const tokenType in wallet) {
        wallet[tokenType] -= (tokensPaid[tokenType] || 0);
    }

    return wallet;
}

function updateCurrentPlayerBonuses(bonus) {
    const currentBonus = getCurrentPlayer()["bonuses"];

    if (currentBonus[bonus] === undefined) {
        currentBonus[bonus] = 1;
    } else {
        currentBonus[bonus]++;
    }

    return currentBonus;
}

function getCurrentPaymentMethod() {
    return JSON.parse(sessionStorage.getItem("paymentMethod"));
}

function setNewPaymentMethod(paymentMethod) {
    sessionStorage.setItem("paymentMethod", JSON.stringify(paymentMethod));
}

export {selectCard,
    processBuyCardClick,
    isAllowedToSwitchToken,
    getPlayerWallet,
    handlePaymentMethodChange,
    removePaidTokens,
    updateCurrentPlayerBonuses,
    getDefaultPaymentMethod};