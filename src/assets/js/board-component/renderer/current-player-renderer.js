import { GEMS } from "../data.js";
import { MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER } from "../config.js";
import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { getTokenAmount, getTotalAmountDiscarded, getTotalTokenAmount } from "../tokens/discard.js";
import { validTokenDiscard } from "../state-machine/valid-action-checker.js";
import {
    addNodesToEmptiedContainer,
    formatNumber,
    getNumberedItemTemplate,
    addSwitchButton,
    renderCard,
    renderProgressBar,
    safeEmptyContainer,
    highlightPointsWinner,
} from "./helper.js";
import {
    allowedToSwitchToken,
    getDefaultPaymentMethod,
    removePaidTokens,
    updateCurrentPlayerBonuses,
} from "../buy-reserve/buy-handler.js";
import { getHighestScore, sumObjectValues } from "../../utils/game-object-handler.js";
import { getClientTokens, getClientTotalPrestigePoints } from "../game-data-handler.js";
import { copyNode } from "../../utils/data-handler.js";
import { isCurrentlyPlaying } from "../game-status-interface.js";
import { insertImageInto } from "../../utils/renderer.js";
import { checkCompatibility } from "../../server-version-component/server-version.js";

function renderGameStatusMessage(currentPlayer) {
    const $statusMessage = document.querySelector("h1");
    $statusMessage.textContent = isCurrentlyPlaying() ? "It's your turn" : `It's ${currentPlayer}'s turn`;
    $statusMessage.dataset.currentlyPlaying = currentPlayer;
}

function renderPlayerProfile(gameCreatorName) {
    document.querySelector(".top-bar h2").textContent = loadFromStorage("playerName");
    renderAvatar(gameCreatorName);
    renderForfeitButton();
}

function renderAvatar(gameCreatorName) {
    const avatar = loadFromStorage("avatar");
    const $avatar = document.querySelector("header div.avatar");

    if ($avatar.childElementCount > 0) return;

    safeEmptyContainer($avatar);
    insertImageInto($avatar, `avatars/${avatar}`, avatar, avatar);

    if (loadFromStorage("playerName") === gameCreatorName) $avatar.querySelector("img").classList.add("game-creator");
}

function renderForfeitButton() {
    checkCompatibility(2)
        .then(isCompatible => {
            document.querySelector(".forfeit").classList.toggle("none", !isCompatible);
        });
}

function renderClientPlayerPoints(totalPrestigePoints, highestScore) {
    saveHighestScore(highestScore);
    renderPrestigePointsScore(totalPrestigePoints);
    renderPrestigePointsProgressBar(totalPrestigePoints);
    addHighestScoreIndicator(totalPrestigePoints, highestScore);
}

function saveHighestScore(highestScore) {
    document.querySelector(".player-points").dataset.highestScore = highestScore;
}

function renderPrestigePointsScore(totalPrestigePoints) {
    const $totalPrestigePoints = document.querySelector(".player-points h4");
    $totalPrestigePoints.dataset.totalPrestigePoints = totalPrestigePoints;
    $totalPrestigePoints.textContent = `${formatNumber(totalPrestigePoints)} / ${PRESTIGE_POINTS_NEEDED_TO_WIN}`;
    highlightPointsWinner(totalPrestigePoints, $totalPrestigePoints);
}

function renderPrestigePointsProgressBar(totalPrestigePoints) {
    const $progressBar = document.querySelector(".player-points .progress-bar");
    renderProgressBar($progressBar, totalPrestigePoints, "score_topdown_chip");
}

function addHighestScoreIndicator(totalPrestigePoints, highestScore) {
    const $highestScoreIndicator = document.querySelector(".player-points picture");
    if (totalPrestigePoints >= highestScore) $highestScoreIndicator.classList.remove("hidden");
}

function renderClientPlayerReserve(currentPlayer) {
    const $reserved = document.querySelector(".reserved-cards ul");
    const reservedCards = currentPlayer["reserve"];
    if (reservedCards.length > 0) {
        addNodesToEmptiedContainer($reserved, reservedCards, renderCard);
    } else {
        safeEmptyContainer($reserved);
        $reserved.insertAdjacentHTML("beforeend", "<p>No reserved cards</p>");
    }
}

function renderClientPlayerTokenCount(tokens) {
    const $totalTokenCount = document.querySelector(".player-tokens #current-tokens");
    document.querySelector(".player-tokens #token-limit").textContent = MAX_TOKENS_ALLOWED;

    const amountOfTokens = formatNumber(countTokens(tokens));
    $totalTokenCount.textContent = amountOfTokens;
    $totalTokenCount.dataset.amount = amountOfTokens;
    $totalTokenCount.dataset.amountToDiscard = 0;
    setTotalTokensColor($totalTokenCount, amountOfTokens);
}

function setTotalTokensColor($totalTokenCount, totalTokens) {
    $totalTokenCount.classList.toggle("highlighted-number", totalTokens > MAX_TOKENS_ALLOWED);
}

function renderClientPlayer(players, gems) {
    let clientPlayer = getPlayerByName(players, loadFromStorage("playerName"));

    if(isNotCurrentActivePlayer(clientPlayer)) {
        clientPlayer = players[0];
    }

    const highestScore = getHighestScore(players);
    renderClientPlayerPoints(clientPlayer["totalPrestigePoints"] , highestScore);

    renderClientPlayerTokenCount(clientPlayer["tokens"]);
    renderClientPlayerTokens(clientPlayer["tokens"], clientPlayer["bonuses"], gems);

    // Needs to know the players tokens to determine if a card should be highlighted
    renderClientPlayerReserve(clientPlayer);

    renderTimer();
}

function isNotCurrentActivePlayer(clientPlayer) {
    return clientPlayer === undefined;
}

function getPlayerByName(players, currentPlayerName) {
    for (const player of players) {
        if (player.name === currentPlayerName) {
            return player;
        }
    }
}

function countTokens(tokens) {
    return sumObjectValues(tokens);
}

function insertCardCounter($token, token, currentPlayerBonuses) {
    insertImageInto($token, `UI/cards/${TOKEN_MAPPER[token]}_card_small`, true, `${TOKEN_MAPPER[token]} card`);
    $token.insertAdjacentHTML("afterbegin", `<p>${currentPlayerBonuses[token] || 0}</p>`);
    $token.dataset.bonuses = currentPlayerBonuses[token] || 0;
}

function renderClientPlayerTokens(currentPlayerTokens, currentPlayerBonuses, gems) {
    const $currentPlayerTokensContainer = document.querySelector(".player-tokens ul");
    safeEmptyContainer($currentPlayerTokensContainer);

    const $numberedItemTemplate = getNumberedItemTemplate();
    const $progressBarTemplate = document.querySelector("#progress-bar-template");
    const $discardNavTemplate = document.querySelector("#token-discard-template");

    for (const token of gems.toReversed()) {
        renderClientToken($numberedItemTemplate, token, $progressBarTemplate, currentPlayerBonuses, currentPlayerTokens, $currentPlayerTokensContainer, $discardNavTemplate);
    }
}

function renderClientToken($numberedItemTemplate, token, $progressBarTemplate, currentPlayerBonuses, currentPlayerTokens, $clientPlayerTokensContainer, $discardNavTemplate) {
    const $token = copyNode($numberedItemTemplate);
    addTokenTypeAmount($token, token, currentPlayerTokens);

    if (token !== "Gold") insertCardCounter($token, token, currentPlayerBonuses);

    insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);

    addProgressBar($progressBarTemplate, currentPlayerTokens, token, $token);
    addSwitchButton($token, token);

    if (validTokenDiscard()) addDiscardNav($discardNavTemplate, $token);

    $clientPlayerTokensContainer.appendChild($token);
}

function addTokenTypeAmount($token, token, currentPlayerTokens) {
    $token.dataset.type = token;
    $token.dataset.amount = (currentPlayerTokens[token] || 0);
    $token.querySelector(".amount").innerHTML = `${(currentPlayerTokens[token] || 0)}<span></span>`;
}

function addProgressBar($progressBarTemplate, currentPlayerTokens, token, $token) {
    const $progressBar = copyNode($progressBarTemplate);
    renderProgressBar($progressBar, currentPlayerTokens[token], `${TOKEN_MAPPER[token]}_topdown_chip`);
    $token.appendChild($progressBar);
}

function addDiscardNav($discardNavTemplate, $token) {
    const $discardNav = copyNode($discardNavTemplate);
    $token.appendChild($discardNav);
    setButtonStatuses();
}

function setButtonStatuses() {
    const totalAmountOfTokens = getTotalTokenAmount();
    const totalAmountDiscarded = getTotalAmountDiscarded();

    for (const $token of document.querySelectorAll(".player-tokens li")) {
        const amountAvailable = getTokenAmount($token);
        const amountInDiscard = parseInt($token.querySelector(".discard-container .amount").dataset.amount);

        const addButton = $token.querySelector("[data-action='add']");
        const removeButton = $token.querySelector("[data-action='remove']");

        addButton.disabled = amountInDiscard === amountAvailable || totalAmountOfTokens - MAX_TOKENS_ALLOWED === totalAmountDiscarded;
        removeButton.disabled = amountInDiscard === 0;
    }
}

function renderSwitchPaymentButtons(currentPayment, cost) {
    const tokensInWallet = getClientTokens();
    const $tokensContainers = document.querySelectorAll(".switch-token-container");
    const defaultPaymentMethod = getDefaultPaymentMethod(cost);
    hideSwitchPaymentButtons();

    for (const $tokenContainer of $tokensContainers) {
        renderSwitchPayment($tokenContainer, currentPayment, defaultPaymentMethod, cost, tokensInWallet);
    }
}

function renderSwitchPayment($tokenSwitchContainer, currentPayment, defaultPaymentMethod, cost, tokensInWallet) {
    const $tokenContainer = $tokenSwitchContainer.closest("li");
    const tokenType = $tokenContainer.dataset.type;

    if (allowedToSwitchToken(tokenType, currentPayment, defaultPaymentMethod, cost, tokensInWallet)) {
        $tokenSwitchContainer.querySelector(".switch-token").classList.remove("hidden");
    }

    if (Object.keys(cost).includes(tokenType) || (tokenType === "Gold" && tokensInWallet["Gold"] > 0)) {
        renderAmountOfTokenSelected($tokenContainer, currentPayment[tokenType]);
    }
}

function renderAmountOfTokenSelected($tokenContainer, paymentOfType) {
    const $amountToTake = $tokenContainer.querySelector(".amount span");
    $amountToTake.textContent = ` - ${paymentOfType}`;
    $amountToTake.classList.remove("hidden");
}

function renderUpdatedPlayerTokens(bonus) {
    const updatedTokens = removePaidTokens();
    const updatedBonuses = updateCurrentPlayerBonuses(bonus);

    renderClientPlayerTokenCount(getClientTokens());
    renderClientPlayerTokens(updatedTokens, updatedBonuses, GEMS);
}

function renderUpdatedPlayerScore(extraScore) {
    let highestScore = parseInt(document.querySelector(".player-points").dataset.highestScore);
    const newPlayerPoints = getClientTotalPrestigePoints() + extraScore;

    if (highestScore < newPlayerPoints) highestScore = newPlayerPoints;

    renderClientPlayerPoints(getClientTotalPrestigePoints() + extraScore, highestScore);
}

function hideSwitchPaymentButtons() {
    document.querySelectorAll(".switch-token-container").forEach(($container) => {
        $container.querySelector(".switch-token").classList.add("hidden");
        $container.closest("li").querySelector(".amount span").classList.add("hidden");
    });
}

function renderTimer() {
    if (isCurrentlyPlaying()) {
        document.querySelector(".timer").style.opacity = "1";
    } else {
        document.querySelector(".timer").style.opacity = "0";
    }
}

function addGoldToken() {
    const $goldTokenCountContainer = document.querySelector(".player-tokens li[data-type='Gold'] .amount");
    $goldTokenCountContainer.textContent = parseInt($goldTokenCountContainer.textContent) + 1;
}

export {
    renderClientPlayer,
    renderSwitchPaymentButtons,
    renderClientPlayerTokenCount,renderClientPlayerTokens,
    renderUpdatedPlayerTokens,
    renderUpdatedPlayerScore,
    hideSwitchPaymentButtons,
    setButtonStatuses,
    addGoldToken,
    renderGameStatusMessage,
    renderPlayerProfile,
};
