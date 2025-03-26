import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {tokensDummyData} from "../dummy-data.js";
import {formatNumber, insertImageInto} from "./helper.js";
import {NOBLES_MAPPER, TOKEN_MAPPER} from "../config.js";
import {renderCurrentPlayer, renderHeader} from "./current-player-renderer.js";

function renderPage(gameData) {
    renderHeader();
    renderOtherPlayers(gameData.players);
    renderCards(gameData.market);
    renderBoardTokens(gameData.unclaimedTokens, gameData.players.length);
    renderNobles(gameData.unclaimedNobles);
    renderCurrentPlayer(gameData.players);
}

function renderOtherPlayers(otherPlayers) {
    const currentPlayerName = loadFromStorage("username");

    const $otherPlayerContainer = document.querySelector(".other-players");
    const $template = document.querySelector("#other-player-card-template");

    for (const otherPlayer of otherPlayers) {
        if (otherPlayer.name !== currentPlayerName) {
            const $playerCard = $template.content.firstElementChild.cloneNode(true);
            $playerCard.querySelector(".name").textContent = otherPlayer.name;
            $playerCard.querySelector(".points").textContent = `${formatNumber(otherPlayer.totalPrestigePoints)} pts.`;

            renderTokenList($playerCard.querySelector(".tokens"), otherPlayer.tokens);
            renderCardList($playerCard.querySelector(".cards"), otherPlayer.bonuses);
            renderReservedList($playerCard.querySelector(".reserved"), otherPlayer.reserve);

            $otherPlayerContainer.appendChild($playerCard);
        }
    }
}

function renderTokenList(containerToInsertInto, tokenAmounts) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");

    for (const token of tokensDummyData.gems) {
        const $token = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
        $token.querySelector(".amount").textContent = tokenAmounts[token] || 0;
        insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);
        containerToInsertInto.appendChild($token);
    }
}

function renderCardList(containerToInsertInto, cardAmounts) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");

    for (const cardType of tokensDummyData.gems) {
        if (cardType !== "Gold") {
            const $card = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
            $card.querySelector(".amount").textContent = cardAmounts[cardType] || 0;
            insertImageInto($card, `UI/cards/${TOKEN_MAPPER[cardType]}_card_small`, false, `${TOKEN_MAPPER[cardType]} card`);
            containerToInsertInto.appendChild($card);
        }
    }
}

function renderReservedList(containerToInsertInto, reservedCards) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");

    for (const reservedCard of reservedCards) {
        const $reservedCard = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
        $reservedCard.querySelector(".amount").textContent = reservedCard.prestigePoints;
        insertImageInto($reservedCard, `cards/empty/${TOKEN_MAPPER[reservedCard.bonus]}_empty_card`, false, `${TOKEN_MAPPER[reservedCard.bonus]} chip`);
        containerToInsertInto.appendChild($reservedCard);
    }
}

function renderCards(market) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");
    const $cardTemplate = document.querySelector("#card-template");

    for (const deck of market) {
        const $currentDeck = document.querySelector(`.level-${deck.level} .cards-in-deck`);

        for (const card of deck.visibleCards) {
            const $card = $cardTemplate.content.firstElementChild.cloneNode(true);
            $card.querySelector(".points").textContent = card.prestigePoints;
            const $cardCost = $card.querySelector(".cost");

            for (const [type, cost] of Object.entries(card.cost)) {
                const $costItem = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
                $costItem.querySelector(".amount").textContent = cost;
                insertImageInto($costItem, `UI/tokens/${TOKEN_MAPPER[type]}_chip`, true, `${TOKEN_MAPPER[type]} chip`);
                $cardCost.appendChild($costItem);
            }

            insertImageInto($card, `cards/empty/${TOKEN_MAPPER[card.bonus]}_empty_card`, false, `${TOKEN_MAPPER[card.bonus]} card`);
            insertImageInto($card, "cards/illustrations/camel", false, "camel");

            $currentDeck.appendChild($card);
        }
    }
}

function getMaxTokens(playerLength) {
    if (playerLength === 2) {
        return 4;
    } else if (playerLength === 3) {
        return 5;
    } else {
        return 7;
    }
}

function renderBoardTokens(unclaimedTokens, playerLength) {
    const $boardTokensContainer = document.querySelector(".board-tokens");

    const $numberedItemTemplate = document.querySelector("#numbered-item-template");

    for (const token of tokensDummyData.gems.reverse()) {
        const $boardToken = $numberedItemTemplate.content.firstElementChild.cloneNode(true);

        let maxTokens = getMaxTokens(playerLength);
        if (token === "Gold") {
            maxTokens = 5;
        }

        $boardToken.querySelector(".amount").textContent = `${unclaimedTokens[token]}/${maxTokens}`;
        insertImageInto($boardToken, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);
        $boardTokensContainer.appendChild($boardToken);
    }
}

function renderNobles(unclaimedNobles) {
    const $noblesContainer = document.querySelector(".nobles");

    const $nobleTemplate = document.querySelector("#noble-template");

    for (const noble of unclaimedNobles) {
        const $noble = $nobleTemplate.content.firstElementChild.cloneNode(true);
        insertImageInto($noble, `nobles/${NOBLES_MAPPER[noble.name]}`, false, "Noble (+3 pts.)");
        $noblesContainer.appendChild($noble);
    }
}

export { renderPage };