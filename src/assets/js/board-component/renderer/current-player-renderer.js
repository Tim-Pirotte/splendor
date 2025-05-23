import { GEMS } from "../data.js";
import { CHIP_SPACING, MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER } from "../config.js";
import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { getTokenAmount, getTotalAmountDiscarded, getTotalTokenAmount } from "../tokens/discard.js";
import { clientMustDiscardToken, validCardBuy } from "../state-machine/valid-action-checker.js";
import {
    addSwitchButton,
    formatNumber,
    getNumberedItemTemplate,
    highlightPointsWinner,
    renderCard,
    safeEmptyContainer,
    constructBackground,
} from "./helper.js";
import {
    allowedToSwitchToken,
    getDefaultPaymentMethod,
    removePaidTokens,
    updateCurrentPlayerBonuses,
} from "../buy-reserve/buy-handler.js";
import { getHighestScore, getPlayerByName, sumObjectValues } from "../../utils/game-object-handler.js";
import { getClientTokens, getClientTotalPrestigePoints } from "../game-data-handler.js";
import { copyNode } from "../../utils/data-handler.js";
import { isCurrentlyPlaying } from "../game-status-interface.js";
import { insertImageInto } from "../../utils/renderer.js";
import { checkCompatibilityFromSessionStorage } from "../../server-version-component/server-version.js";
import { reflowCSS } from "../helper.js";
import { isSpectator } from "../state-machine/state-machine.js";
import { TIME_AFTER_SPECTATOR_DOES_NOT_GET_RENDERED } from "../../config.js";
import { animateShiftListItems, getVisibleListItemsBoundingBoxes } from "../animation-component/animation-handler.js";
import { reserveCardShiftAnimation } from "../animation-component/data.js";

function renderGameStatusMessage(currentPlayer) {
    const isClientPlayerTurn = currentPlayer === loadFromStorage("playerName");
    const $statusMessage = document.querySelector("h1");

    $statusMessage.textContent = isClientPlayerTurn ? "It's your turn" : `It's ${currentPlayer}'s turn`;
    $statusMessage.dataset.currentlyPlaying = currentPlayer;
}

function renderAmountOfSpectators(spectators, compatible) {
    if (!compatible) {
        toggleSpectatorsEyeVisibility(false);
        return;
    }

    const amountOfSpectators = spectators.filter(
    spectator => spectator.pollDelta < TIME_AFTER_SPECTATOR_DOES_NOT_GET_RENDERED,
    ).length;

    document.querySelector(".amount-of-spectators").textContent = amountOfSpectators;
    toggleSpectatorsEyeVisibility(amountOfSpectators > 0);
}

function toggleSpectatorsEyeVisibility(visible) {
    document.querySelector(".amount-of-spectators").classList.toggle("hidden", !visible);
    document.querySelector(".spectator-eye-indicator").classList.toggle("hidden", !visible);
}

function renderPlayerProfile(gameCreatorName, spectators) {
    const playerName = loadFromStorage("playerName");

    document.querySelector(".top-bar h2").textContent = playerName;
    renderAvatar(gameCreatorName);
    renderForfeitButton(playerName, spectators);
}

function renderAvatar(gameCreatorName) {
    const avatar = loadFromStorage("avatar") || "placeholder";
    const $avatar = document.querySelector("header div.avatar");

    if ($avatar.childElementCount > 0) return;

    safeEmptyContainer($avatar);
    insertImageInto($avatar, `avatars/${avatar}`, avatar, avatar);

    if (loadFromStorage("playerName") === gameCreatorName) $avatar.querySelector("img").classList.add("game-creator");
}

function renderForfeitButton(playerName, spectators) {
    document.querySelector(".forfeit")
        .classList.toggle("none", !checkCompatibilityFromSessionStorage(2) || isSpectator(spectators, playerName));
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
    $progressBar.style.background = constructBackground(totalPrestigePoints, "score_topdown_chip", CHIP_SPACING);
}

function addHighestScoreIndicator(totalPrestigePoints, highestScore) {
    const $highestScoreIndicator = document.querySelector(".player-points picture");

    $highestScoreIndicator.classList.toggle("hidden", highestScore > totalPrestigePoints);
}

function renderClientPlayerReserve(reservedCards) {
    const $reserved = document.querySelector(".reserved-cards ul");
    const $reservedContainer = $reserved.closest(".reserved-cards");

    if (reservedCards.length > 0) {
        $reservedContainer.querySelector("h4").innerHTML = "";
        renderReservedCards($reserved, reservedCards);
    } else {
        safeEmptyContainer($reserved);
        $reservedContainer.querySelector("h4").innerHTML = "No reserved cards";
    }
}

function renderReservedCards($reserved, reservedCards) {
    const originalReservedAmount = $reserved.children.length;

    const sourceBoundingBoxes = getVisibleListItemsBoundingBoxes($reserved);
    removeBoughtCards($reserved);
    const targetBoundingBoxes = getVisibleListItemsBoundingBoxes($reserved);

    if (originalReservedAmount !== $reserved.children.length) {
        animateShiftListItems($reserved.querySelectorAll(":scope > li"), sourceBoundingBoxes, targetBoundingBoxes, reserveCardShiftAnimation);
    }

    for (const card of reservedCards) {
        const $reservedCard = getCardFromReserve($reserved, card);

        if ($reservedCard) {
            $reservedCard.classList.toggle(`${TOKEN_MAPPER[card["bonus"]]}-buyable-card`, validCardBuy(card["name"]));
        } else {
            $reserved.appendChild(renderCard(card));
        }
    }
}

function removeBoughtCards($reserved) {
    for (const $boughtCard of $reserved.querySelectorAll(".hidden")) {
        $boughtCard.outerHTML = "";
    }
}

function getCardFromReserve($reserved, card) {
    return $reserved.querySelector(`[data-name="${card["name"]}"]`);
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

function renderClientPlayer(players, gems, compatible) {
    let clientPlayer = getPlayerByName(players, loadFromStorage("playerName"));

    if (isNotCurrentActivePlayer(clientPlayer)) {
        clientPlayer = players[0];
    }

    const highestScore = getHighestScore(players);
    renderClientPlayerPoints(clientPlayer["totalPrestigePoints"], highestScore);

    renderClientPlayerTokenCount(clientPlayer["tokens"]);
    renderClientPlayerTokens(clientPlayer["tokens"], clientPlayer["bonuses"], gems);

    // Needs to know the player tokens to determine if a card should be highlighted
    renderClientPlayerReserve(clientPlayer["reserve"]);

    renderTimer(compatible);
}

function isNotCurrentActivePlayer(clientPlayer) {
    return clientPlayer === undefined;
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

    if (clientMustDiscardToken()) setDiscardButtonStatuses();
}

function renderClientToken($numberedItemTemplate, token, $progressBarTemplate, currentPlayerBonuses, currentPlayerTokens, $clientPlayerTokensContainer, $discardNavTemplate) {
    const $token = copyNode($numberedItemTemplate);
    addTokenTypeAmount($token, token, currentPlayerTokens);

    if (token !== "Gold") insertCardCounter($token, token, currentPlayerBonuses);

    insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);

    addSwitchButton($token, token);

    if (clientMustDiscardToken()) addDiscardNav($discardNavTemplate, $token);

    addProgressBar($progressBarTemplate, currentPlayerTokens, token, $token);

    $clientPlayerTokensContainer.appendChild($token);
}

function addTokenTypeAmount($token, token, currentPlayerTokens) {
    $token.dataset.type = token;
    $token.dataset.amount = (currentPlayerTokens[token] || 0);
    $token.querySelector(".amount").innerHTML = `${(currentPlayerTokens[token] || 0)}<span></span>`;
}

function addProgressBar($progressBarTemplate, currentPlayerTokens, token, $token) {
    const $progressBarContainer = copyNode($progressBarTemplate);
    $progressBarContainer.querySelector(".progress-bar").style.background = constructBackground(currentPlayerTokens[token], `${TOKEN_MAPPER[token]}_topdown_chip`, CHIP_SPACING);

    $token.appendChild($progressBarContainer);
}

function addDiscardNav($discardNavTemplate, $token) {
    $token.appendChild(copyNode($discardNavTemplate));
}

function setDiscardButtonStatuses() {
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

function renderAmountOfTokenSelected($tokenContainer, amount) {
    if (amount <= 0) return;

    const $amountToTake = $tokenContainer.querySelector(".amount span");
    $amountToTake.textContent = ` - ${amount}`;
    $amountToTake.classList.remove("none");
    $tokenContainer.querySelector(".amount").classList.add("pulsing-text");
}

function renderUpdatedPlayerTokens(bonus) {
    const updatedTokens = removePaidTokens();
    const updatedBonuses = updateCurrentPlayerBonuses(bonus);

    renderClientPlayerTokenCount(getClientTokens());

    for (const token of GEMS) {
        const $token = document.querySelector(`.player-tokens [data-type="${token}"]`);
        $token.querySelector(".amount").innerHTML = `${(updatedTokens[token] || 0)}<span></span>`;

        const $bonusCounter = $token.querySelector("p:not(.amount)");

        if ($bonusCounter) $bonusCounter.textContent = updatedBonuses[token];
    }
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
        $container.closest("li").querySelector(".amount span").classList.add("none");
        $container.closest("li").querySelector(".amount").classList.remove("pulsing-text");
        reflowCSS($container);
    });
}

function renderTimer(compatible) {

    if (isCurrentlyPlaying() && compatible) {
        document.querySelector(".timer").style.opacity = "1";
    } else {
        document.querySelector(".timer").style.opacity = "0";
    }
}

function addGoldToken() {
    const $goldTokenCountContainer = document.querySelector(".player-tokens li[data-type='Gold'] .amount");

    if (parseInt(document.querySelector(".board-tokens li[data-type='Gold']").dataset.amount)) {
        $goldTokenCountContainer.textContent = parseInt($goldTokenCountContainer.textContent) + 1;
    }
}

export {
    renderClientPlayer,
    renderSwitchPaymentButtons,
    renderClientPlayerTokenCount,
    renderClientPlayerTokens,
    renderUpdatedPlayerTokens,
    renderUpdatedPlayerScore,
    hideSwitchPaymentButtons,
    setDiscardButtonStatuses,
    addGoldToken,
    renderGameStatusMessage,
    renderPlayerProfile,
    renderClientPlayerReserve,
    renderAmountOfSpectators,
};
