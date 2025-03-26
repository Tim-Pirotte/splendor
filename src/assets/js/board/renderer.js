import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {tokensDummyData} from "./dummy-data.js";
import {insertImageInto, renderProgressBar} from "./helper.js";
import {MAX_TOKENS_ALLOWED, NOBLES_MAPPER, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER} from "./config.js";

function renderPage(gameData) {
    renderClientUser();
    renderOtherPlayers(gameData.players);
    renderCards(gameData.market);
    renderBoardTokens(gameData.unclaimedTokens, gameData.players.length);
    renderNobles(gameData.unclaimedNobles);
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
        insertImageInto($token, "UI/tokens/" + TOKEN_MAPPER[token] + "_chip", false, TOKEN_MAPPER[token] + " chip");
        containerToInsertInto.appendChild($token);
    }
}

function renderCardList(containerToInsertInto, cardAmounts) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");

    for (const cardType of tokensDummyData.gems) {
        if (cardType !== "Gold") {
            const $card = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
            $card.querySelector(".amount").textContent = cardAmounts[cardType] || 0;
            insertImageInto($card, "UI/cards/" + TOKEN_MAPPER[cardType] + "_card_small", false, TOKEN_MAPPER[cardType] + " card");
            containerToInsertInto.appendChild($card);
        }
    }
}

function renderReservedList(containerToInsertInto, reservedCards) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");

    for (const reservedCard of reservedCards) {
        const $reservedCard = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
        $reservedCard.querySelector(".amount").textContent = reservedCard.prestigePoints;
        insertImageInto($reservedCard, "cards/empty/" + TOKEN_MAPPER[reservedCard.bonus] + "_empty_card", false, TOKEN_MAPPER[reservedCard.bonus] + " chip");
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
                insertImageInto($costItem, "UI/tokens/" + TOKEN_MAPPER[type] + "_chip", true, TOKEN_MAPPER[type] + " chip");
                $cardCost.appendChild($costItem);
            }

            insertImageInto($card, "cards/empty/" + TOKEN_MAPPER[card.bonus] + "_empty_card", false, TOKEN_MAPPER[card.bonus] + " card");
            insertImageInto($card, "cards/illustrations/camel", false, "camel");

            $currentDeck.appendChild($card);
        }
    }
}

function countTokens(tokens) {
    return Object.values(tokens).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function renderCurrentPlayerTokens(currentPlayerTokens, currentPlayerBonuses) {
    const $currentPlayerTokensContainer = document.querySelector(".player-tokens ul");

    const $numberedItemTemplate = document.querySelector("#numbered-item-template");
    const $progressBarTemplate = document.querySelector("#progress-bar-template");

    for (const token of tokensDummyData.gems) {
        const $token = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
        const $progressBar = $progressBarTemplate.content.firstElementChild.cloneNode(true);

        if (token !== "Gold") {
            insertImageInto($token, "UI/cards/" + TOKEN_MAPPER[token] + "_card_small", true, TOKEN_MAPPER[token] + " card");
            $token.insertAdjacentHTML("afterbegin", `<p>${currentPlayerBonuses[token] || 0}</p>`)
        }

        $token.querySelector(".amount").textContent = currentPlayerTokens[token] || 0;
        insertImageInto($token, "UI/tokens/" + TOKEN_MAPPER[token] + "_chip", false, TOKEN_MAPPER[token] + " chip");
        renderProgressBar($progressBar, currentPlayerTokens[token], TOKEN_MAPPER[token]);

        $token.appendChild($progressBar);
        $currentPlayerTokensContainer.appendChild($token);
    }
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
                    insertImageInto($costItem, "UI/tokens/" + TOKEN_MAPPER[type] + "_chip", true, TOKEN_MAPPER[type] + " chip");
                    $cardCost.appendChild($costItem);
                }

                insertImageInto($card, "cards/empty/" + TOKEN_MAPPER[card.bonus] + "_empty_card", false, TOKEN_MAPPER[card.bonus] + " card");
                insertImageInto($card, "cards/illustrations/camel", false, "camel");

                $reserved.appendChild($card);
            }

            document.querySelector(".player-tokens h4").textContent = countTokens(player.tokens) + " / " + MAX_TOKENS_ALLOWED;

            renderCurrentPlayerTokens(player.tokens, player.bonuses);
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
        insertImageInto($boardToken, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, TOKEN_MAPPER[token] + " chip")
        $boardTokensContainer.appendChild($boardToken);
    }
}

function renderNobles(unclaimedNobles) {
    const $noblesContainer = document.querySelector(".nobles");

    const $nobleTemplate = document.querySelector("#noble-template");

    for (const noble of unclaimedNobles) {
        const $noble = $nobleTemplate.content.firstElementChild.cloneNode(true);
        insertImageInto($noble, "nobles/" + NOBLES_MAPPER[noble.name], false, "Noble (+3 pts.)");
        $noblesContainer.appendChild($noble);
    }
}

export { renderPage };