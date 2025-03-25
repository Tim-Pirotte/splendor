import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {tokensDummyData} from "./dummy-data.js";
import {insertImageInto, renderProgressBar} from "./helper.js";
import {MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN} from "./config.js";

const mapTokens = {
    "Emerald": "green",
    "Sapphire": "blue",
    "Ruby": "red",
    "Diamond": "white",
    "Onyx": "black",
    "Gold": "gold",
}

function renderPage(gameData) {
    renderClientUser();
    renderOtherPlayers(gameData.players);
    renderCards(gameData.market);
    renderCurrentPlayer(gameData.players);
}

function renderClientUser() {
    document.querySelector(".top-bar h2").textContent = loadFromStorage("username")
}

function renderOtherPlayers(otherPlayers) {
    const currentPlayerName = loadFromStorage("username");

    const $otherPlayerContainer = document.querySelector(".other-players");
    const $template = document.querySelector("#other-player-card-template");

    for (const otherPlayer of otherPlayers) {
        if (otherPlayer.name !== currentPlayerName) {
            const $playerCard = $template.content.firstElementChild.cloneNode(true);
            $playerCard.querySelector(".name").textContent = otherPlayer.name;
            $playerCard.querySelector(".points").textContent = otherPlayer.totalPrestigePoints + " pts.";

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
        insertImageInto($token, "UI/tokens/" + mapTokens[token] + "_chip");
        containerToInsertInto.appendChild($token);
    }
}

function renderCardList(containerToInsertInto, cardAmounts) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");

    for (const cardType of tokensDummyData.gems) {
        if (cardType !== "Gold") {
            const $card = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
            $card.querySelector(".amount").textContent = cardAmounts[cardType] || 0;
            insertImageInto($card, "UI/cards/" + mapTokens[cardType] + "_card_small");
            containerToInsertInto.appendChild($card);
        }
    }
}

function renderReservedList(containerToInsertInto, reservedCards) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");

    for (const reservedCard of reservedCards) {
        const $reservedCard = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
        $reservedCard.querySelector(".amount").textContent = reservedCard.prestigePoints;
        insertImageInto($reservedCard, "cards/empty/" + mapTokens[reservedCard.bonus] + "_empty_card");
        containerToInsertInto.appendChild($reservedCard);
    }
}

function renderCards(market) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");
    const $cardTemplate = document.querySelector("#card-template");

    for (const deck of market) {
        const $currentDeck = document.querySelector(".level-" + deck.level + " .cards-in-deck");

        for (const card of deck.visibleCards) {
            const $card = $cardTemplate.content.firstElementChild.cloneNode(true);
            $card.querySelector(".points").textContent = card.prestigePoints;
            const $cardCost = $card.querySelector(".cost");

            for (const [type, cost] of Object.entries(card.cost)) {
                const $costItem = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
                $costItem.querySelector(".amount").textContent = cost;
                insertImageInto($costItem, "UI/tokens/" + mapTokens[type] + "_chip", true);
                $cardCost.appendChild($costItem);
            }

            insertImageInto($card, "cards/empty/" + mapTokens[card.bonus] + "_empty_card");
            insertImageInto($card, "cards/illustrations/camel");

            $currentDeck.appendChild($card);
        }
    }
}

function countTokens(tokens) {
    return Object.values(tokens).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function renderCurrentPlayer(players) {
    const currentPlayerName = loadFromStorage("username");
    for (const player of players) {
        if (player.name === currentPlayerName) {
            document.querySelector(".player-points p").textContent = player.totalPrestigePoints.toString().padStart(2, '0') + "/" + PRESTIGE_POINTS_NEEDED_TO_WIN;

            renderProgressBar(document.querySelector(".player-points .progress-bar"), player.totalPrestigePoints, "red");

            const $numberedItemTemplate = document.querySelector("#numbered-item-template");
            const $cardTemplate = document.querySelector("#card-template");

            const $reserved = document.querySelector(".reserved-cards ul")

            for (const card of player.reserve) {
                const $card = $cardTemplate.content.firstElementChild.cloneNode(true);
                $card.querySelector(".points").textContent = card.prestigePoints;
                const $cardCost = $card.querySelector(".cost");

                for (const [type, cost] of Object.entries(card.cost)) {
                    const $costItem = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
                    $costItem.querySelector(".amount").textContent = cost;
                    insertImageInto($costItem, "UI/tokens/" + mapTokens[type] + "_chip", true);
                    $cardCost.appendChild($costItem);
                }

                insertImageInto($card, "cards/empty/" + mapTokens[card.bonus] + "_empty_card");
                insertImageInto($card, "cards/illustrations/camel");

                $reserved.appendChild($card);
            }

            document.querySelector(".player-tokens h4").textContent = countTokens(player.tokens) + " / " + MAX_TOKENS_ALLOWED;
        }
    }
}

export { renderPage };