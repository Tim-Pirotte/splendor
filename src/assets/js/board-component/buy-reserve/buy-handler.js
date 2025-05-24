import * as API from "../../api.js";
import { getActionButton, setActionButtonState } from "../game-status-interface.js";
import {
    hideSwitchPaymentButtons, renderMissingTokens,
    renderSwitchPaymentButtons,
    renderUpdatedPlayerScore,
    renderUpdatedPlayerTokens,
} from "../renderer/current-player-renderer.js";
import { DEVELOPMENT_CARDS } from "../data.js";
import { renderUpdatedBoardTokens } from "../renderer/board-renderer.js";
import { sumObjectValues } from "../helper.js";
import { getClientBonuses, getClientTokens } from "../game-data-handler.js";
import { binarySearchObjects } from "../../utils/data-handler.js";
import { endBuyReserveAction, getReserveCardButton, setReserveButtonData } from "./helper.js";
import { unHighlightTokens } from "../tokens/token-handler.js";
import { renderCard } from "../renderer/helper.js";
import { setAnimationDelayBeforePolling, buyCardAnimation } from "../animation-component/data.js";
import { animateFromTo } from "../animation-component/animation-handler.js";

function allowToBuy($card) {
    const cardData = getCardData($card.dataset.name);
    const defaultPayment = getDefaultPaymentMethod(cardData["cost"]);

    setNewPaymentMethod(defaultPayment);
    renderSwitchPaymentButtons(defaultPayment, cardData["cost"]);
}

function setActionToBuyReserve($card, isValidCardBuy, isValidCardReserve, deckLevel = "") {
    const datasetParameters = deckLevel ? {} : { name: $card.dataset.name };
    const $reserveCardButton = getReserveCardButton();

    hideSwitchPaymentButtons();
    highlightCard($card);

    setActionButtonState("buy",  "processBuyCardClick", datasetParameters, true);

    setReserveButtonData($card, deckLevel);

    if (isValidCardBuy) allowToBuy($card);
    if (!isValidCardBuy && deckLevel === "") renderMissingTokens();

    $reserveCardButton.classList.remove("hidden");

    getActionButton().disabled = !isValidCardBuy;
    $reserveCardButton.disabled = !isValidCardReserve;
}

function highlightCard($card) {
    unHighlightTokens();
    unHighlightCards();
    $card.classList.add("selected-card");
}

function unHighlightCards() {
    for (const $cardToDeselect of document.querySelectorAll(".selected-card")) {
        $cardToDeselect.classList.remove("selected-card");
    }
}

function canBuy(name) {
    const cost = getCardData(name)["cost"];
    const wallet = getPlayerWallet();

    return isWalletHigher(wallet, cost);
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

function getCard(e) {
    return e.target.closest(".card");
}

function processBuyCardClick() {
    const $actionButton = getActionButton();
    const cardData = getCardData($actionButton.dataset.name);

    renderUpdatedPlayerTokens(cardData["bonus"]);
    renderUpdatedPlayerScore(cardData["prestigePoints"]);

    renderUpdatedBoardTokens(JSON.parse(sessionStorage.getItem("paymentMethod")));
    endBuyReserveAction();

    playBuyCardAnimation(cardData);

    API.buyCard({ development: { name: cardData["name"] }, payment: getCurrentPaymentMethod() });
}

function getCardData(cardName) {
    return binarySearchObjects(DEVELOPMENT_CARDS, cardName, "name");
}

function playBuyCardAnimation(cardData) {
    const $source = document.querySelector(`[data-name="${cardData["name"]}"]`);
    $source.classList.add("hidden");

    const $targetContainer = document.querySelector(`.player-tokens [data-type="${cardData["bonus"]}"]`);
    setAnimationDelayBeforePolling(buyCardAnimation.duration);

    const $card = renderCard(cardData);
    $targetContainer.prepend($card);

    animateFromTo($source, $card, buyCardAnimation);
}

function getDefaultPaymentMethod(cost) {
    const tokens = getClientTokens();
    const bonuses = getClientBonuses();
    const costWithoutBonuses = removeBonusesFromCost(cost, bonuses);

    return calculateDefaultPayment(costWithoutBonuses, tokens);
}

function removeBonusesFromCost(cost, bonuses) {
    const costWithoutBonuses = {};

    for (const tokenType in cost) {
        costWithoutBonuses[tokenType] = Math.max(cost[tokenType] - bonuses[tokenType], 0)
    }

    return costWithoutBonuses;
}

function calculateDefaultPayment(cost, tokens) {
    const payment = { "Gold": 0 };

    for (const [tokenType, amount] of Object.entries(cost)) {
        payment[tokenType] = Math.min(amount, tokens[tokenType]);
        payment["Gold"] += Math.max(amount - tokens[tokenType], 0);
    }

    return payment;
}

function allowedToSwitchToken(tokenType, currentPayment, defaultPaymentMethod, cost, tokensInWallet) {
    const goldInPayment = currentPayment["Gold"] || 0;
    const goldInDefaultPayment = defaultPaymentMethod["Gold"] || 0;

    if (tokenType === "Gold") {
        return goldInPayment !== goldInDefaultPayment;
    } else if (goldInPayment === (tokensInWallet["Gold"] || 0)) {
        return false;
    } else if (!(tokenType in cost)) {
        return false;
    } else {
        return (currentPayment[tokenType]) > 0;
    }
}

function handlePaymentMethodChange(e) {
    const $button = e.target.closest("button");

    if ($button?.classList.contains("switch-token")) {
        const tokenType = e.target.closest("li").dataset.type;
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
    const wallet = getClientTokens();
    const tokensPaid = getCurrentPaymentMethod();

    for (const tokenType in wallet) {
        wallet[tokenType] -= (tokensPaid[tokenType] || 0);
    }

    return wallet;
}

function updateCurrentPlayerBonuses(bonus) {
    const currentBonus = getClientBonuses();

    if (currentBonus[bonus]) {
        currentBonus[bonus]++;
    } else {
        currentBonus[bonus] = 1;
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
    processBuyCardClick,
    allowedToSwitchToken,
    handlePaymentMethodChange,
    removePaidTokens,
    updateCurrentPlayerBonuses,
    getDefaultPaymentMethod,
    canBuy,
    unHighlightCards,
    getCard,
    highlightCard,
    setActionToBuyReserve,
    allowToBuy,
};
