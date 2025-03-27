import {loadFromStorage, saveToStorage} from "../../data-connector/local-storage-abstractor.js";
import {MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER} from "../config.js";
import {
    formatNumber,
    insertImageInto,
    renderCard,
    renderProgressBar,
    safeEmptyContainer
} from "./helper.js";
import {
    isAllowedToSwitchToken,
    getPlayerWallet,
    getCurrentPlayerIndexInData,
    updateCurrentPlayerTokensInData
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
    console.log(currentPlayer["tokens"])
    document.querySelector(".player-tokens h4").textContent = `${formatNumber(countTokens(currentPlayer["tokens"]))} / ${MAX_TOKENS_ALLOWED}`;
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
    const $switchPaymentButtonTemplate = document.querySelector("#switch-to-gold-button-template");

    for (const token of gems.toReversed()) {
        const $token = $numberedItemTemplate.content.firstElementChild.cloneNode(true);

        const $progressBar = $progressBarTemplate.content.firstElementChild.cloneNode(true);

        let $switchPaymentButtonContainer = $switchPaymentButtonTemplate.content.firstElementChild.cloneNode(true);

        $token.dataset.tokenType = token;

        if (token !== "Gold") {
            insertCardCounter($token, token, currentPlayerBonuses);
        } else {
            $switchPaymentButtonContainer = document.querySelector("#reset-payment-template")
                                            .content.firstElementChild.cloneNode(true);
        }

        $switchPaymentButtonContainer.querySelector(".switch-token").dataset.type = token;
        $token.querySelector(".amount").textContent = currentPlayerTokens[token] || 0;
        insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);
        renderProgressBar($progressBar, currentPlayerTokens[token], TOKEN_MAPPER[token]);


        $token.appendChild($progressBar);
        $token.appendChild($switchPaymentButtonContainer)

        $currentPlayerTokensContainer.appendChild($token);
    }
}

function renderSwitchPaymentButtons(currentPayment, cost) {
    const $tokensContainers = document.querySelectorAll(".switch-token-container");

    $tokensContainers.forEach($token => $token.classList.add("hidden"));

    const wallet = getPlayerWallet();

    for (const $tokenContainer of $tokensContainers) {
        const tokenType = $tokenContainer.querySelector(".switch-token").dataset.type;

        if (isAllowedToSwitchToken(tokenType, currentPayment, cost, wallet)) {
            $tokenContainer.classList.remove("hidden");
            renderAmountOfTokenSelected($tokenContainer, tokenType, currentPayment);
        }
    }
}

function renderAmountOfTokenSelected($tokenContainer, tokenType, payment) {
    $tokenContainer.querySelector("span").innerText = payment[tokenType]
}

function renderUpdatedTokens(bonus) {
    const gameData = loadFromStorage("gameData")
    const indexOfPlayerInData = getCurrentPlayerIndexInData(gameData);
    const updatedTokens = updateCurrentPlayerTokensInData(gameData, indexOfPlayerInData);
    const updatedBonuses = updateCurrentPlayerBonuses(gameData, indexOfPlayerInData, bonus);

    gameData["players"][indexOfPlayerInData]["bonuses"] = updatedBonuses;
    gameData["players"][indexOfPlayerInData]["tokens"] = updatedTokens;
    saveToStorage("gameData", gameData)

    renderCurrentPlayerTokenCount(gameStatusInterface.getCurrentPlayer());
    renderCurrentPlayerTokens(updatedTokens, gameData["players"][indexOfPlayerInData]["bonuses"], loadFromStorage("gems"));
}

function renderUpdatedPlayerScore(extraScore) {
    const previousScore = document.querySelector(".points");
    console.log(previousScore);
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
export {renderHeader,
    renderCurrentPlayer,
    renderSwitchPaymentButtons,
    renderCurrentPlayerTokenCount,renderCurrentPlayerTokens,
    renderUpdatedTokens,
    renderUpdatedPlayerScore};