import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER } from "../config.js";
import { formatNumber, insertImageInto, renderCard, renderProgressBar, safeEmptyContainer } from "./helper.js";

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
}

function renderCurrentPlayerTokens(currentPlayerTokens, currentPlayerBonuses, gems) {
    const $currentPlayerTokensContainer = document.querySelector(".player-tokens ul");
    safeEmptyContainer($currentPlayerTokensContainer);

    const $numberedItemTemplate = document.querySelector("#numbered-item-template");
    const $progressBarTemplate = document.querySelector("#progress-bar-template");

    for (const token of gems.toReversed()) {
        const $token = $numberedItemTemplate.content.firstElementChild.cloneNode(true);

        const $progressBar = $progressBarTemplate.content.firstElementChild.cloneNode(true);

        if (token !== "Gold") {
            insertCardCounter($token, token, currentPlayerBonuses);
        }

        $token.querySelector(".amount").textContent = currentPlayerTokens[token] || 0;
        insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);
        renderProgressBar($progressBar, currentPlayerTokens[token], TOKEN_MAPPER[token]);

        $token.appendChild($progressBar);
        $currentPlayerTokensContainer.appendChild($token);
    }
}

export { renderHeader, renderCurrentPlayer };
