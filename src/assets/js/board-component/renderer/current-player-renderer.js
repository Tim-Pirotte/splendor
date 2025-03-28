import {loadFromStorage, saveToStorage} from "../../data-connector/local-storage-abstractor.js";
import {MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER} from "../config.js";
import {
    formatNumber, getSwitchButtonTemplate,
    insertImageInto,
    renderCard,
    renderProgressBar,
    safeEmptyContainer
} from "./helper.js";
import {
    isAllowedToSwitchToken,
    getPlayerWallet,
    getCurrentPlayerIndexInData,
    removePaidTokens, updateCurrentPlayerBonuses
} from "../buy/buy-handler.js";
import * as gameStatusInterface from "../game-status-interface.js";

function renderHeader() {
    document.querySelector(".top-bar h2").textContent = loadFromStorage("playerName");
}

function getCurrentPlayer(players, currentPlayerName) {
    for (const player of players) {
        if (player.name === currentPlayerName) {
            return player;
        }
    }
}

function renderCurrentPlayerPoints(currentPlayer) {
    document.querySelector(".player-points p").textContent = `${formatNumber(currentPlayer["totalPrestigePoints"])}  / ${PRESTIGE_POINTS_NEEDED_TO_WIN}`;

    renderProgressBar(document.querySelector(".player-points .progress-bar"), currentPlayer["totalPrestigePoints"], "score");
}

function renderCurrentPlayerReserve(currentPlayer) {
    const $reserved = document.querySelector(".reserved-cards ul");
    safeEmptyContainer($reserved);

    for (const card of currentPlayer["reserve"]) {
        renderCard($reserved, card["prestigePoints"], card["bonus"], card["cost"]);
    }
}

function renderCurrentPlayerTokenCount(currentPlayer) {
    const $totalTokenCount = document.querySelector(".player-tokens #current-tokens");
    document.querySelector(".player-tokens #token-limit").textContent = MAX_TOKENS_ALLOWED;

    const amountOfTokens = formatNumber(countTokens(currentPlayer["tokens"]));
    $totalTokenCount.textContent = amountOfTokens;
    setTotalTokensColor($totalTokenCount, amountOfTokens);
}

function setTotalTokensColor($totalTokenCount, totalTokens) {
    if (totalTokens > MAX_TOKENS_ALLOWED) {
        $totalTokenCount.classList.add("highlighted-number");
    }
}

function renderCurrentPlayer(players, gems) {
    const currentPlayer = getCurrentPlayer(players, loadFromStorage("playerName"));

    renderCurrentPlayerPoints(currentPlayer);
    renderCurrentPlayerReserve(currentPlayer);
    renderCurrentPlayerTokenCount(currentPlayer);
    renderCurrentPlayerTokens(currentPlayer["tokens"], currentPlayer["bonuses"], gems);
}

function countTokens(tokens) {
    return Object.values(tokens).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function insertCardCounter($token, token, currentPlayerBonuses) {
    insertImageInto($token, `UI/cards/${TOKEN_MAPPER[token]}_card_small`, true, `${TOKEN_MAPPER[token]} card`);
    $token.insertAdjacentHTML("afterbegin", `<p>${currentPlayerBonuses[token] || 0}</p>`);
    $token.dataset.bonuses = currentPlayerBonuses[token] || 0;
    $token.dataset.type = token;
}

function renderCurrentPlayerTokens(currentPlayerTokens, currentPlayerBonuses, gems) {
    const $currentPlayerTokensContainer = document.querySelector(".player-tokens ul");
    safeEmptyContainer($currentPlayerTokensContainer);
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");
    const $progressBarTemplate = document.querySelector("#progress-bar-template");

    for (const token of gems.toReversed()) {
        const $token = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
        const $progressBar = $progressBarTemplate.content.firstElementChild.cloneNode(true);
        const $switchPaymentButtonContainer = getSwitchButtonTemplate(token);

        $token.dataset.tokenType = token;
        if (token !== "Gold") {
            insertCardCounter($token, token, currentPlayerBonuses);
        }

        $switchPaymentButtonContainer.querySelector(".switch-token").dataset.type = token;
        $token.querySelector(".amount").textContent = (currentPlayerTokens[token] || 0);
        insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);
        renderProgressBar($progressBar, currentPlayerTokens[token], TOKEN_MAPPER[token]);
        $token.appendChild($progressBar);
        $token.appendChild($switchPaymentButtonContainer);
        $currentPlayerTokensContainer.appendChild($token);
    }
}

function renderSwitchPaymentButtons(currentPayment, cost) {
    const wallet = getPlayerWallet();
    const $tokensContainers = document.querySelectorAll(".switch-token-container");

    $tokensContainers.forEach($tokenContainer => {
        $tokenContainer.querySelector(".switch-token").classList.add("hidden");
        $tokenContainer.querySelector("p").classList.add("hidden");
    });

    for (const $tokenContainer of $tokensContainers) {
        const tokenType = $tokenContainer.querySelector(".switch-token").dataset.type;
        if (isAllowedToSwitchToken(tokenType, currentPayment, cost, wallet)) {
            $tokenContainer.querySelector(".switch-token").classList.remove("hidden");
        }

        if (Object.keys(cost).includes(tokenType) || (tokenType === "Gold" && wallet["Gold"] > 0)) {
            renderAmountOfTokenSelected($tokenContainer, tokenType, currentPayment);
        }
    }
}

function renderAmountOfTokenSelected($tokenContainer, tokenType, payment) {
    $tokenContainer.querySelector("span").innerText = (payment[tokenType]);
    $tokenContainer.querySelector("p").classList.remove("hidden");
}

function renderUpdatedTokens(bonus) {
    const gameData = loadFromStorage("gameData");
    const indexOfPlayerInData = getCurrentPlayerIndexInData(gameData);
    const updatedTokens = removePaidTokens(gameData, indexOfPlayerInData);
    const updatedBonuses = updateCurrentPlayerBonuses(gameData, indexOfPlayerInData, bonus);

    gameData["players"][indexOfPlayerInData]["bonuses"] = updatedBonuses;
    gameData["players"][indexOfPlayerInData]["tokens"] = updatedTokens;
    saveToStorage("gameData", gameData);

    renderCurrentPlayerTokenCount(gameStatusInterface.getCurrentPlayer());
    renderCurrentPlayerTokens(updatedTokens, gameData["players"][indexOfPlayerInData]["bonuses"], loadFromStorage("gems"));
}

function renderUpdatedPlayerScore(extraScore) {
    const $scoreContainer = document.querySelector(".points");
    const score = parseInt($scoreContainer.innerText.split(" ")[0]) + extraScore;

    $scoreContainer.innerText = `${formatNumber(score)} pts.`;
}

function hideSwitchPaymentButtons() {
    document.querySelectorAll(".switch-token-container").forEach(($container) => {
        $container.querySelector(".switch-token").classList.add("hidden");
        $container.querySelector("p").classList.add("hidden");
    });
}
export {renderHeader,
    renderCurrentPlayer,
    renderSwitchPaymentButtons,
    renderCurrentPlayerTokenCount,renderCurrentPlayerTokens,
    renderUpdatedTokens,
    renderUpdatedPlayerScore,
    hideSwitchPaymentButtons};