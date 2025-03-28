import {getCurrentPlayer, setActionButtonState} from "../game-status-interface.js";
import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {
    renderSwitchPaymentButtons, renderUpdatedPlayerScore, renderUpdatedTokens
} from "../renderer/current-player-renderer.js";
import {fetchFromServer} from "../../data-connector/api-communication-abstractor.js";
import {DEVELOPMENT_CARDS} from "../data.js";

function selectCard(e) {
    const $card = getCard(e);
    if ($card && canBuy($card)) {
        const defaultPayment = getDefaultPaymentMethod(getCardData($card.dataset.name)["cost"]);

        setActionButtonState(
        "buy",
        "processBuyCardClick",
        {name: $card.dataset.name},
        );

        setNewPaymentMethod(defaultPayment);
        renderSwitchPaymentButtons(defaultPayment, getCardData($card.dataset.name)["cost"]);
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
    const $actionButton = document.querySelector(".action-button");
    const cardData = getCardData($actionButton.dataset.name);
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

function isAllowedToSwitchToken(tokenType, currentPayment, cost, tokensInWallet) {
    console.log(currentPayment["Gold"] || 0);
    console.log(tokensInWallet["Gold"] || 0);

    if (tokenType === "Gold") {
        return ((currentPayment["Gold"] || 0) !== 0);
    } else if ((currentPayment["Gold"] || 0) === (tokensInWallet["Gold"] || 0)){
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

function getCurrentPlayerIndexInData(gameData) {
    const playerName = getCurrentPlayer()["name"];
    for (const playerIndex in gameData["players"]) {
        if (gameData["players"][playerIndex]["name"] === playerName) {
            return playerIndex;
        }
    }
}

function removePaidTokens() {
    const wallet = getPlayerWallet()
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
    getCurrentPlayerIndexInData,
    removePaidTokens,
    updateCurrentPlayerBonuses,
    getDefaultPaymentMethod};