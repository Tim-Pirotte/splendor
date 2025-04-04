import * as API from "../../api.js";
import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER } from "../config.js";
import { getTokenAmount, getTotalAmountDiscarded, getTotalTokenAmount } from "../token/discard.js";
import { validTokenDiscard } from "../state-machine/valid-action-checker.js";
import {
    addNodesToEmptiedContainer,
    formatNumber,
    getNumberedItemTemplate,
    addSwitchButton,
    insertImageInto, renderCard,
    renderProgressBar,
    safeEmptyContainer, toggleClass, highlightPointsWinner,
} from "./helper.js";
import { allowedToSwitchToken, removePaidTokens, updateCurrentPlayerBonuses } from "../buy-reserve/buy-handler.js";
import { GEMS } from "../data.js";
import { getHighestScore, sumObjectValues, getPlayersObjects } from "../../utils/game-object-handler.js";
import { getClientTokens, getClientTotalPrestigePoints } from "../game-data-handler.js";
import { copyNode } from "../../utils/data-handler.js";
import { isCurrentlyPlaying } from "../game-status-interface.js";

function renderHeader(currentPlayer) {
    renderGameStatusMessage(currentPlayer);
    renderPlayerProfile();
}

function renderGameStatusMessage(currentPlayer) {
    const $statusMessage = document.querySelector("h1");
    $statusMessage.textContent = isCurrentlyPlaying() ? "It's your turn" : `It's ${currentPlayer}'s turn`;
    $statusMessage.dataset.currentlyPlaying = currentPlayer;
}

function renderPlayerProfile() {
    document.querySelector(".top-bar h2").textContent = loadFromStorage("playerName");
    renderAvatar();
}

function renderAvatar() {
    const avatar = loadFromStorage("avatar");
    const $avatar = document.querySelector("header div.avatar");
    safeEmptyContainer($avatar);
    insertImageInto($avatar, `avatars/${avatar}`, avatar);
}

function renderClientPlayerPoints(totalPrestigePoints, highestScore) {
    renderPrestigePointsScore(totalPrestigePoints);
    renderPrestigePointsProgressBar(totalPrestigePoints);
    addHighestScoreIndicator(totalPrestigePoints, highestScore);
}

function renderPrestigePointsScore(totalPrestigePoints) {
    const $totalPrestigePoints = document.querySelector(".player-points p");
    $totalPrestigePoints.dataset.totalPrestigePoints = totalPrestigePoints;
    $totalPrestigePoints.textContent = `${formatNumber(totalPrestigePoints)} / ${PRESTIGE_POINTS_NEEDED_TO_WIN}`;
    highlightPointsWinner(totalPrestigePoints, $totalPrestigePoints);
}

function renderPrestigePointsProgressBar(totalPrestigePoints) {
    const $progressBar = document.querySelector(".player-points .progress-bar");
    renderProgressBar($progressBar, totalPrestigePoints, "score");
}

function addHighestScoreIndicator(totalPrestigePoints, highestScore) {
    const $playerDiamondLocation = document.querySelector(".player-points p");

    if (totalPrestigePoints >= highestScore) insertImageInto($playerDiamondLocation, "UI/tokens/white_chip", false, "Score amongst the highest");
}

function renderClientPlayerReserve(currentPlayer) {
    const $reserved = document.querySelector(".reserved-cards ul");
    addNodesToEmptiedContainer($reserved, currentPlayer["reserve"], renderCard);
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
    toggleClass($totalTokenCount, "highlighted-number", totalTokens > MAX_TOKENS_ALLOWED);
}

function renderClientPlayer(players, gems) {
    const clientPlayer = getPlayer(players, loadFromStorage("playerName"));

    const highestScore = getHighestScore(players);
    renderClientPlayerPoints(clientPlayer["totalPrestigePoints"] , highestScore);

    renderClientPlayerReserve(clientPlayer);
    renderClientPlayerTokenCount(clientPlayer["tokens"]);
    renderClientPlayerTokens(clientPlayer["tokens"], clientPlayer["bonuses"], gems);
    renderTimer();
}

function getPlayer(players, currentPlayerName) {
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
    $token.querySelector(".amount").textContent = (currentPlayerTokens[token] || 0);
}

function addProgressBar($progressBarTemplate, currentPlayerTokens, token, $token) {
    const $progressBar = copyNode($progressBarTemplate);
    renderProgressBar($progressBar, currentPlayerTokens[token], TOKEN_MAPPER[token]);
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

    hideSwitchPayment($tokensContainers);

    for (const $tokenContainer of $tokensContainers) {
        renderSwitchPayment($tokenContainer, currentPayment, cost, tokensInWallet);
    }
}

function renderSwitchPayment($tokenContainer, currentPayment, cost, tokensInWallet) {
    const tokenType = $tokenContainer.closest("li").dataset.type;

    if (allowedToSwitchToken(tokenType, currentPayment, cost, tokensInWallet)) {
        $tokenContainer.querySelector(".switch-token").classList.remove("hidden");
    }

    if (Object.keys(cost).includes(tokenType) || (tokenType === "Gold" && tokensInWallet["Gold"] > 0)) {
        renderAmountOfTokenSelected($tokenContainer, currentPayment[tokenType]);
    }
}

function hideSwitchPayment($tokenSwitchContainers) {
    $tokenSwitchContainers.forEach($tokenSwitchContainer => {
        $tokenSwitchContainer.querySelector(".switch-token").classList.add("hidden");
        $tokenSwitchContainer.querySelector("p").classList.add("hidden");
    });
}

function renderAmountOfTokenSelected($tokenContainer, paymentOfType) {
    $tokenContainer.querySelector("span").textContent = paymentOfType;
    $tokenContainer.querySelector("p").classList.remove("hidden");
}

function renderUpdatedPlayerTokens(bonus) {
    const updatedTokens = removePaidTokens();
    const updatedBonuses = updateCurrentPlayerBonuses(bonus);

    renderClientPlayerTokenCount(getClientTokens());
    renderClientPlayerTokens(updatedTokens, updatedBonuses, GEMS);
}

function renderUpdatedPlayerScore(extraScore) {
    API.getGame().then(gameObject => {
        const players = getPlayersObjects(gameObject);
        const highestScore = getHighestScore(players);

        renderClientPlayerPoints(getClientTotalPrestigePoints() + extraScore, highestScore);
    });
}

function hideSwitchPaymentButtons() {
    document.querySelectorAll(".switch-token-container").forEach(($container) => {
        $container.querySelector(".switch-token").classList.add("hidden");
        $container.querySelector("p").classList.add("hidden");
    });
}

function renderTimer() {
    if (isCurrentlyPlaying()) {
        document.querySelector(".timer").style.display = "block";
    } else {
        document.querySelector(".timer").style.display = "none";
    }
}

function addGoldToken() {
    const $goldTokenCountContainer = document.querySelector(".player-tokens li[data-type='Gold'] .amount");
    $goldTokenCountContainer.textContent = parseInt($goldTokenCountContainer.textContent) + 1;
}

export {
    renderHeader,
    renderClientPlayer,
    renderSwitchPaymentButtons,
    renderClientPlayerTokenCount,renderClientPlayerTokens,
    renderUpdatedPlayerTokens,
    renderUpdatedPlayerScore,
    hideSwitchPaymentButtons,
    setButtonStatuses,
    addGoldToken,
};
