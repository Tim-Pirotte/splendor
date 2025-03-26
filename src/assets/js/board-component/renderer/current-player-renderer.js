import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER} from "../config.js";
import {formatNumber, insertImageInto, renderCard, renderProgressBar} from "./helper.js";
import {tokensDummyData} from "../dummy-data.js";

function renderHeader() {
    document.querySelector(".top-bar h2").textContent = loadFromStorage("username");
}

function getCurrentPlayer(players, currentPlayerName) {
    for (const player of players) {
        if (player.name === currentPlayerName) {
            return player;
        }
    }
}

function renderCurrentPlayerPoints(currentPlayer) {
    document.querySelector(".player-points p").textContent = `${formatNumber(currentPlayer.totalPrestigePoints)}  / ${PRESTIGE_POINTS_NEEDED_TO_WIN}`;

    renderProgressBar(document.querySelector(".player-points .progress-bar"), currentPlayer.totalPrestigePoints, "score");
}

function renderCurrentPlayerReserve(currentPlayer) {
    const $reserved = document.querySelector(".reserved-cards ul");

    for (const card of currentPlayer.reserve) {
        renderCard($reserved, card.prestigePoints, card.bonus, card.cost);
    }
}

function renderCurrentPlayerTokenCount(currentPlayer) {
    document.querySelector(".player-tokens h4").textContent = `${formatNumber(countTokens(currentPlayer.tokens))} / ${MAX_TOKENS_ALLOWED}`;
}

function renderCurrentPlayer(players) {
    const currentPlayer = getCurrentPlayer(players, loadFromStorage("username"));

    renderCurrentPlayerPoints(currentPlayer);
    renderCurrentPlayerReserve(currentPlayer);
    renderCurrentPlayerTokenCount(currentPlayer);
    renderCurrentPlayerTokens(currentPlayer.tokens, currentPlayer.bonuses);
}

function countTokens(tokens) {
    return Object.values(tokens).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function insertCardCounter($token, token, currentPlayerBonuses) {
    insertImageInto($token, `UI/cards/${TOKEN_MAPPER[token]}_card_small`, true, `${TOKEN_MAPPER[token]} card`);
    $token.insertAdjacentHTML("afterbegin", `<p>${currentPlayerBonuses[token] || 0}</p>`);
}

function renderCurrentPlayerTokens(currentPlayerTokens, currentPlayerBonuses) {
    const $currentPlayerTokensContainer = document.querySelector(".player-tokens ul");

    const $numberedItemTemplate = document.querySelector("#numbered-item-template");
    const $progressBarTemplate = document.querySelector("#progress-bar-template");

    for (const token of tokensDummyData.gems.toReversed()) {
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

export {renderHeader, renderCurrentPlayer};