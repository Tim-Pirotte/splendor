import * as API from "../../api.js";
import * as gameStatusInterface from "../game-status-interface.js";
import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER } from "../config.js";
import {
    formatNumber,
    getSwitchButtonTemplate,
    insertImageInto,
    renderCard,
    renderProgressBar,
    safeEmptyContainer,
} from "./helper.js";
import { getHighestScore } from "./sidebar-renderer.js";
import { isAllowedToSwitchToken, removePaidTokens, updateCurrentPlayerBonuses } from "../buy/buy-handler.js";
import { GEMS } from "../data.js";
import { getPlayersObjects } from "../../utils/game-object-handler.js";

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

function renderCurrentPlayerPoints(currentPlayer, highestScore, extraScore = 0) {
    document.querySelector(".player-points p").textContent =
    `${formatNumber(parseInt(currentPlayer["totalPrestigePoints"]) + extraScore)}  / ${PRESTIGE_POINTS_NEEDED_TO_WIN}`;

    renderProgressBar(document.querySelector(".player-points .progress-bar"), currentPlayer["totalPrestigePoints"], "score");
    const $playerDiamondLocation = document.querySelector(".player-points p");

    if (currentPlayer["totalPrestigePoints"] >= highestScore) {
        insertImageInto($playerDiamondLocation, "UI/tokens/white_chip", false, "Score amongst the highest");
    }
}

function renderCurrentPlayerReserve(currentPlayer) {
    const $reserved = document.querySelector(".reserved-cards ul");
    safeEmptyContainer($reserved);

    for (const card of currentPlayer["reserve"]) {
        renderCard($reserved, card["prestigePoints"], card["bonus"], card["cost"]);
    }
}

function renderCurrentPlayerTokenCount(tokens) {
    const $totalTokenCount = document.querySelector(".player-tokens #current-tokens");
    document.querySelector(".player-tokens #token-limit").textContent = MAX_TOKENS_ALLOWED;

    const amountOfTokens = formatNumber(countTokens(tokens));
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
    const highestScore = getHighestScore(players);

    renderCurrentPlayerPoints(currentPlayer , highestScore);
    renderCurrentPlayerReserve(currentPlayer);
    renderCurrentPlayerTokenCount(currentPlayer["tokens"]);
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
    const tokensInWallet = gameStatusInterface.getCurrentPlayer()["tokens"];
    const $tokensContainers = document.querySelectorAll(".switch-token-container");

    $tokensContainers.forEach($tokenContainer => {
        $tokenContainer.querySelector(".switch-token").classList.add("hidden");
        $tokenContainer.querySelector("p").classList.add("hidden");
    });

    for (const $tokenContainer of $tokensContainers) {
        const tokenType = $tokenContainer.querySelector(".switch-token").dataset.type;
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

    renderCurrentPlayerTokenCount(gameStatusInterface.getCurrentPlayer()["tokens"]);
    renderCurrentPlayerTokens(updatedTokens, updatedBonuses, GEMS);
}

function renderUpdatedPlayerScore(extraScore) {
    API.getGame().then(gameObject => {
        const players = getPlayersObjects(gameObject);
        const highestScore = getHighestScore(players);

        renderCurrentPlayerPoints(gameStatusInterface.getCurrentPlayer(), highestScore, extraScore);
    });
}

function hideSwitchPaymentButtons() {
    document.querySelectorAll(".switch-token-container").forEach(($container) => {
        $container.querySelector(".switch-token").classList.add("hidden");
        $container.querySelector("p").classList.add("hidden");
    });
}
export { renderHeader,
    renderCurrentPlayer,
    renderSwitchPaymentButtons,
    renderCurrentPlayerTokenCount,renderCurrentPlayerTokens,
    renderUpdatedPlayerTokens,
    renderUpdatedPlayerScore,
    hideSwitchPaymentButtons,
};
