import * as API from "../../api.js";
import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER } from "../config.js";
import { isAllowedToSwitchToken, removePaidTokens, updateCurrentPlayerBonuses } from "../buy-reserve/buy-handler.js";
import { GEMS } from "../data.js";
import { getHighestScore, sumObjectValues, getPlayersObjects } from "../../utils/game-object-handler.js";
import { getClientTokens, getClientTotalPrestigePoints } from "../game-data-handler.js";
import { copyNode } from "../../utils/data-handler.js";
import { getTokenAmount, getTotalAmountDiscarded, getTotalTokenAmount } from "../token/discard.js";
import { validTokenDiscard } from "../state-machine/valid-action-checker.js";
import { isCurrentlyPlaying } from "../game-status-interface.js";
import {
    formatNumber,
    getNumberedItemTemplate,
    getSwitchButtonTemplate,
    insertImageInto,
    renderCard,
    renderProgressBar,
    safeEmptyContainer,
} from "./helper.js";

function renderHeader(currentPlayer) {
    const $playerName = document.querySelector(".top-bar h2");
    const $avatar = document.querySelector("header div.avatar");

    const playerName = loadFromStorage("playerName");
    const avatar = loadFromStorage("avatar");

    $playerName.textContent = playerName;
    $avatar.innerHTML = "";
    insertImageInto($avatar, `avatars/${avatar}`, avatar);

    $playerName.dataset.currentlyPlaying = currentPlayer;

    document.querySelector("h1").textContent = isCurrentlyPlaying() ?
        "It's your turn" : `${loadFromStorage("gameData")["currentPlayer"]}'s turn`;
}

function getCurrentPlayer(players, currentPlayerName) {
    for (const player of players) {
        if (player.name === currentPlayerName) {
            return player;
        }
    }
}

function renderClientPlayerPoints(totalPrestigePoints, highestScore) {
    const $totalPrestigePoints = document.querySelector(".player-points p");
    $totalPrestigePoints.dataset.totalPrestigePoints = totalPrestigePoints;
    $totalPrestigePoints.textContent =
    `${formatNumber(totalPrestigePoints)} / ${PRESTIGE_POINTS_NEEDED_TO_WIN}`;

    renderProgressBar(document.querySelector(".player-points .progress-bar"), totalPrestigePoints, "score");
    const $playerDiamondLocation = document.querySelector(".player-points p");

    if (totalPrestigePoints >= highestScore) {
        insertImageInto($playerDiamondLocation, "UI/tokens/white_chip", false, "Score amongst the highest");
    }
}

function renderClientPlayerReserve(currentPlayer) {
    const $reserved = document.querySelector(".reserved-cards ul");
    safeEmptyContainer($reserved);

    for (const card of currentPlayer["reserve"]) {
        renderCard($reserved, card["prestigePoints"], card["bonus"], card["cost"], card["name"], true);
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
    if (totalTokens > MAX_TOKENS_ALLOWED) {
        $totalTokenCount.classList.add("highlighted-number");
    } else {
        $totalTokenCount.classList.remove("highlighted-number");
    }
}

function renderClientPlayer(players, gems) {
    const currentPlayer = getCurrentPlayer(players, loadFromStorage("playerName"));
    const highestScore = getHighestScore(players);

    renderClientPlayerPoints(currentPlayer["totalPrestigePoints"] , highestScore);
    renderClientPlayerReserve(currentPlayer);
    renderClientPlayerTokenCount(currentPlayer["tokens"]);
    renderClientPlayerTokens(currentPlayer["tokens"], currentPlayer["bonuses"], gems);
    renderTimer();
}

function countTokens(tokens) {
    return sumObjectValues(tokens);
}

function insertCardCounter($token, token, currentPlayerBonuses) {
    insertImageInto($token, `UI/cards/${TOKEN_MAPPER[token]}_card_small`, true, `${TOKEN_MAPPER[token]} card`);
    $token.insertAdjacentHTML("afterbegin", `<p>${currentPlayerBonuses[token] || 0}</p>`);
    $token.dataset.bonuses = currentPlayerBonuses[token] || 0;
}

function renderClientToken($numberedItemTemplate, token, $progressBarTemplate, currentPlayerBonuses, currentPlayerTokens, $discardNavTemplate, $currentPlayerTokensContainer) {
    const $token = copyNode($numberedItemTemplate);
    $token.dataset.type = token;

    const $progressBar = copyNode($progressBarTemplate);
    const $switchPaymentButtonContainer = getSwitchButtonTemplate(token);

    if (token !== "Gold") {
        insertCardCounter($token, token, currentPlayerBonuses);
    }

    $token.querySelector(".amount").textContent = (currentPlayerTokens[token] || 0);
    $token.dataset.amount = (currentPlayerTokens[token] || 0);

    insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);
    renderProgressBar($progressBar, currentPlayerTokens[token], TOKEN_MAPPER[token]);

    $token.appendChild($progressBar);
    $token.appendChild($switchPaymentButtonContainer);

    if (validTokenDiscard()) {
        const $discardNav = copyNode($discardNavTemplate);
        $token.appendChild($discardNav);
        setButtonStatuses();
    }

    $currentPlayerTokensContainer.appendChild($token);
}

function renderClientPlayerTokens(currentPlayerTokens, currentPlayerBonuses, gems) {
    const $currentPlayerTokensContainer = document.querySelector(".player-tokens ul");
    safeEmptyContainer($currentPlayerTokensContainer);

    const $numberedItemTemplate = getNumberedItemTemplate();
    const $progressBarTemplate = document.querySelector("#progress-bar-template");
    const $discardNavTemplate = document.querySelector("#token-discard-template");

    for (const token of gems.toReversed()) {
        renderClientToken($numberedItemTemplate, token, $progressBarTemplate, currentPlayerBonuses, currentPlayerTokens, $discardNavTemplate, $currentPlayerTokensContainer);
    }
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

    hideSwitchPaymentButtons();

    for (const $tokenContainer of $tokensContainers) {
        const tokenType = $tokenContainer.closest("li").dataset.type;

        if (isAllowedToSwitchToken(tokenType, currentPayment, cost, tokensInWallet)) {
            $tokenContainer.querySelector(".switch-token").classList.remove("hidden");
        }

        if (Object.keys(cost).includes(tokenType) || (tokenType === "Gold" && tokensInWallet["Gold"] > 0)) {
            renderAmountOfTokenSelected($tokenContainer, tokenType, currentPayment);
        }
    }
}

function renderAmountOfTokenSelected($tokenContainer, tokenType, payment) {
    $tokenContainer.querySelector("span").innerText = (payment[tokenType]);
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
