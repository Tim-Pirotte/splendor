import * as API from "../../api.js";
import { clearDatasetAttributes, getActionButton, setActionButtonState } from "../game-status-interface.js";
import {
    renderSwitchPaymentButtons,
    renderUpdatedPlayerScore,
    renderUpdatedPlayerTokens,
} from "../renderer/current-player-renderer.js";
import { DEVELOPMENT_CARDS } from "../data.js";
import { renderUpdatedBoardTokens } from "../renderer/board-renderer.js";
import { sumObjectValues } from "../helper.js";
import { getClientBonuses, getClientTokens } from "../game-data-handler.js";
import { binarySearchObjects } from "../../utils/data-handler.js";
import { endBuyReserveAction, getReserveCardButton } from "./helper.js";
import { unHighlightTokens } from "../tokens/token-handler.js";

function allowToBuy($card) {
    const cardData = getCardData($card.dataset.name);
    const defaultPayment = getDefaultPaymentMethod(cardData["cost"]);

    setNewPaymentMethod(defaultPayment);
    renderSwitchPaymentButtons(defaultPayment, cardData["cost"]);
}

function setActionToBuyReserve($card, deckLevel = "", selectedAReservedCard = false) {
    const datasetParameters = deckLevel ? {} : { name: $card.dataset.name };
    setActionButtonState(
        "buy",
        "processBuyCardClick",
        datasetParameters,
        true,
    );

    const $reserveCardButton = getReserveCardButton();

    clearDatasetAttributes($reserveCardButton);

    if (selectedAReservedCard) getActionButton().dataset.reservedCard = "true";

    if (deckLevel) {
        $reserveCardButton.dataset.level = deckLevel;
    } else {
        $reserveCardButton.dataset.name = $card.dataset.name;
    }

    $reserveCardButton.classList.remove("hidden");
}

function unHighlightCards() {
    for (const $cardToDeselect of document.querySelectorAll(".selected-card")) {
        $cardToDeselect.classList.remove("selected-card");
    }
}

function highlightCard($card) {
    unHighlightTokens();
    unHighlightCards();
    $card.classList.add("selected-card");
}

function cardAlreadySelected(cardName) {
    return getActionButton().dataset.name === cardName;
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

    renderUpdatedPlayerTokens(cardData["bonus"]);
    renderUpdatedPlayerScore(cardData["prestigePoints"]);
    renderUpdatedBoardTokens(JSON.parse(sessionStorage.getItem("paymentMethod")));
    endBuyReserveAction();

    if (getActionButton().dataset.reservedCard) {
        API.buyReserveCard({ payment: getCurrentPaymentMethod() })
            .then(() => sessionStorage.removeItem("paymentMethod"));
    } else {
        API.buyCard({ development: { name: cardData["name"] }, payment: getCurrentPaymentMethod() })
            .then(() => sessionStorage.removeItem("paymentMethod"));
    }
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
    processBuyCardClick,
    isAllowedToSwitchToken,
    getPlayerWallet,
    handlePaymentMethodChange,
    removePaidTokens,
    updateCurrentPlayerBonuses,
    getDefaultPaymentMethod,
    canBuy,
    unHighlightCards,
    getCard,
    cardAlreadySelected,
    highlightCard,
    setActionToBuyReserve,
    allowToBuy,
};
