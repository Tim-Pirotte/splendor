import {getCurrentPlayer, setActionButtonState} from "../game-status-interface.js";
import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {
    renderSwitchPaymentButtons, renderUpdatedPlayerScore, renderUpdatedTokens
} from "../renderer/current-player-renderer.js";
import {fetchFromServer} from "../../data-connector/api-communication-abstractor.js";

function selectCard(e) {
    const card = getCard(e);
    if (card && canBuy(card)) {
        const defaultPayment = getDefaultPaymentMethod(getCardData(card)["cost"]);

        setActionButtonState(
        "buy",
        "processBuyCardClick",
        {level: card.dataset.level, index: card.dataset.index},
        );

        setNewPaymentMethod(defaultPayment);
        renderSwitchPaymentButtons(defaultPayment, getCardData(card)["cost"]);
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
    const requestBody =
    {development: {name: cardData["name"]}, payment: getCurrentPaymentMethod()};

    renderUpdatedTokens(cardData["bonus"]);
    renderUpdatedPlayerScore(cardData["prestigePoints"]);

    fetchFromServer(`/games/${loadFromStorage(
    "gameId")}/players/${loadFromStorage("playerName")}/developments`,
    "POST",
    requestBody,
    );
    sessionStorage.removeItem("paymentMethod");
}

function getCardData($target) {
    const index = $target.dataset.index;
    const level = $target.dataset.level;
    return loadFromStorage("gameData")["market"][parseInt(level) - 1]["visibleCards"][index];
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

    return tokens;
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

function isAllowedToSwitchToken(tokenType, currentPayment, cost, wallet) {
    if (tokenType === "Gold") {
        return ((currentPayment["Gold"] || 0) !== 0);
    } else if ((currentPayment["Gold"]) === (wallet["Gold"])){
        return false;
    } else if (!(cost.hasOwnProperty(tokenType))) {
        return false;
    } else{
        return (currentPayment[tokenType]) >0;
    }
}

function handlePaymentMethodChange(e) {
    if (e.target.classList.contains("switch-token")) {
        const tokenType = e.target.dataset.type;
        const cost = getCardData(document.querySelector(".action-button"))["cost"];
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

function getCurrentPlayerIndexInData(gameData) {
    const playerName = getCurrentPlayer()["name"];
    for (const playerIndex in gameData["players"]) {
        if (gameData["players"][playerIndex]["name"] === playerName) {
            return playerIndex;
        }
    }
}

function updateCurrentPlayerTokensInData(gameData, indexOfPlayerInData) {
    const tokensPaid = getCurrentPaymentMethod();
    const previousTokens = gameData["players"][indexOfPlayerInData]["tokens"];
    for (const tokenType in previousTokens) {
        previousTokens[tokenType] -= (tokensPaid[tokenType] || 0);
    }
    return previousTokens;
}

function updateCurrentPlayerBonuses(gameData, indexOfPlayerInData, bonus) {
    const currentBonus = gameData["players"][indexOfPlayerInData]["bonuses"];
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
    getCurrentPlayerIndexInData,
    updateCurrentPlayerTokensInData,
    updateCurrentPlayerBonuses,
    getDefaultPaymentMethod};