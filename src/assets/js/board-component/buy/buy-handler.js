import * as API from "../../api.js";
import { getActionButton, setActionButtonState } from "../game-status-interface.js";
import {
    hideSwitchPaymentButtons,
    renderSwitchPaymentButtons,
    renderUpdatedPlayerScore,
    renderUpdatedPlayerTokens,
} from "../renderer/current-player-renderer.js";
import { DEVELOPMENT_CARDS } from "../data.js";
import { renderUpdatedBoardTokens } from "../renderer/board-renderer.js";
import { sumObjectValues } from "../helper.js";
import { getClientBonuses, getClientTokens } from "../game-data-handler.js";
import { binarySearchObjects } from "../../utils/data-handler.js";
import {validCardBuy, validCardReserve, validDeckReserve} from "../state-machine/valid-action-checker.js";

function allowToBuy($card) {
    setActionButtonState(
        "buy",
        "processBuyCardClick",
        { name: $card.dataset.name },
    );

    const cardData = getCardData($card.dataset.name);
    const defaultPayment = getDefaultPaymentMethod(cardData["cost"]);

    getActionButton().disabled = false;
    setNewPaymentMethod(defaultPayment);
    renderSwitchPaymentButtons(defaultPayment, cardData["cost"]);
}

function allowToReserve() {
    // TODO
}

function selectCard(e) {
    const $card = getCard(e);
    if (!$card) return;

    const cardName = $card.dataset.name;

    if (cardAlreadySelected(cardName)) {
        $card.classList.remove("selected-card");
        deselectCard();

        return;
    }

    const isValidCardBuy = validCardBuy(cardName);
    const isValidCardReserve = validCardReserve();

    if (isValidCardBuy || isValidCardReserve) highlightCard($card);

    if (isValidCardBuy) {
        allowToBuy($card);
        getActionButton().disabled = false;
    } else {
        getActionButton().disabled = true;
    }

    if (isValidCardReserve) allowToReserve();
}

function highlightCard($card) {
    document.querySelectorAll(".selected-card").forEach($card => $card.classList.remove("selected-card"));
    $card.classList.add("selected-card");
}

function cardAlreadySelected(cardName) {
    return getActionButton().dataset.name === cardName;
}

function deselectCard() {
    sessionStorage.removeItem("paymentMethod");
    getActionButton().disabled = false;
    hideSwitchPaymentButtons();
}

function canBuy(name) {
    const cost = getCardData(name)["cost"];
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
        { development: { name: cardData["name"] }, payment: getCurrentPaymentMethod() };

    renderUpdatedPlayerTokens(cardData["bonus"]);
    renderUpdatedPlayerScore(cardData["prestigePoints"]);
    renderUpdatedBoardTokens(JSON.parse(sessionStorage.getItem("paymentMethod")));

    API.buyCard(requestBody).then(() => sessionStorage.removeItem("paymentMethod"));

}

function getCardData(cardName) {
    return binarySearchObjects(DEVELOPMENT_CARDS, cardName, "name");
}

function getPlayerWallet() {
    const tokens = getClientTokens();
    const bonuses = getClientBonuses();

    return sumObjectValues(tokens, bonuses);
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
    const tokens = getClientTokens();
    const bonuses = getClientBonuses();

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
    const payment = { "Gold": 0 };

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

function resetPayment(cost) {
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
    const currentBonus = getClientBonuses();

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

export {
    selectCard,
    processBuyCardClick,
    isAllowedToSwitchToken,
    getPlayerWallet,
    handlePaymentMethodChange,
    removePaidTokens,
    updateCurrentPlayerBonuses,
    getDefaultPaymentMethod,
    deselectCard,
    canBuy,
};
