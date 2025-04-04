import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import {
    formatNumber,
    getNumberedItemTemplate, highlightPointsWinner,
    insertImageInto,
    safeEmptyContainer,
} from "./helper.js";
import { TOKEN_MAPPER } from "../config.js";
import { MAX_PRESTIGE_POINTS } from "../../config.js";
import { getHighestScore } from "../../utils/game-object-handler.js";
import { copyNode } from "../../utils/data-handler.js";
import { GEMS } from "../data.js";
import { avatars } from "../../main-menu-component/data.js";

function renderOtherPlayers(otherPlayers, currentPlayer) {
    const currentPlayerName = loadFromStorage("playerName");
    const highestScore = getHighestScore(otherPlayers);

    const $otherPlayerContainer = document.querySelector(".other-players");
    safeEmptyContainer($otherPlayerContainer);

    const $playerTemplate = document.querySelector("#other-player-card-template");

    for (const otherPlayer of otherPlayers) {
        if (otherPlayer.name !== currentPlayerName) {
            $otherPlayerContainer.appendChild(renderOtherPlayer($playerTemplate, otherPlayer, highestScore, currentPlayer));
        }
    }
}

function renderOtherPlayer($playerTemplate, otherPlayer, highestScore, currentPlayer) {
    const $playerCard = copyNode($playerTemplate);
    const playerName = otherPlayer.name;
    const avatar = avatars[playerName.toLowerCase().charCodeAt(0) % avatars.length];

    showOtherPlayerTurn(playerName, currentPlayer, $playerCard);

    insertImageInto($playerCard, `avatars/${avatar}`, true, avatar);
    setPlayerName($playerCard, otherPlayer);
    setPlayerPoints($playerCard, otherPlayer["totalPrestigePoints"], highestScore);

    renderTokenList($playerCard.querySelector(".tokens"), otherPlayer["tokens"], GEMS);
    renderCardList($playerCard.querySelector(".cards"), otherPlayer["bonuses"], GEMS);
    renderReservedList($playerCard.querySelector(".reserved"), otherPlayer["reserve"]);

    return $playerCard;
}

function showOtherPlayerTurn(playerName, currentPlayer, $playerCard) {
    if (playerName === currentPlayer) $playerCard.classList.add("current-player");
}

function setPlayerName($playerCard, otherPlayer) {
    $playerCard.querySelector(".name").textContent = otherPlayer.name;
}

function setPlayerPoints($playerCard, prestigePoints, highestScore) {
    const $playerPoints = $playerCard.querySelector(".points span");
    $playerPoints.textContent = formatNumber(prestigePoints);

    highlightPointsWinner(prestigePoints, $playerPoints);

    if (prestigePoints >= highestScore) insertImageInto($playerCard, "UI/tokens/white_chip", false, "Score amongst the highest");
}

function renderTokenList(containerToInsertInto, tokenAmounts, gems) {
    const $numberedItemTemplate = getNumberedItemTemplate();

    for (const gem of gems) {
        renderToken($numberedItemTemplate, tokenAmounts, gem, containerToInsertInto);
    }
}

function renderToken($numberedItemTemplate, tokenAmounts, gem, containerToInsertInto) {
    const $token = copyNode($numberedItemTemplate);

    $token.querySelector(".amount").textContent = tokenAmounts[gem] || 0;
    insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[gem]}_chip`, false, `${TOKEN_MAPPER[gem]} chip`);

    containerToInsertInto.appendChild($token);
}

function renderCardList(containerToInsertInto, cardAmounts, gems) {
    const $numberedItemTemplate = getNumberedItemTemplate();

    for (const cardType of gems) {
        if (cardType !== "Gold") {
            renderSmallCard($numberedItemTemplate, cardAmounts, cardType, containerToInsertInto);
        }
    }
}

function renderSmallCard($numberedItemTemplate, cardAmounts, cardType, containerToInsertInto) {
    const $card = copyNode($numberedItemTemplate);
    $card.querySelector(".amount").textContent = cardAmounts[cardType] || 0;

    insertImageInto($card, `UI/cards/${TOKEN_MAPPER[cardType]}_card_small`, false, `${TOKEN_MAPPER[cardType]} card`);

    containerToInsertInto.appendChild($card);
}

function renderReservedList(containerToInsertInto, reservedCards) {
    const $numberedItemTemplate = getNumberedItemTemplate();

    for (const reservedCard of reservedCards) {
        renderOtherPlayerReservedCard($numberedItemTemplate, reservedCard, containerToInsertInto);
    }
}

function renderOtherPlayerReservedCard($numberedItemTemplate, reservedCard, containerToInsertInto) {
    const $reservedCard = copyNode($numberedItemTemplate);
    $reservedCard.querySelector(".amount").textContent = reservedCard["prestigePoints"];

    insertImageInto($reservedCard, `cards/empty/${TOKEN_MAPPER[reservedCard["bonus"]]}_empty_card`, false, `${TOKEN_MAPPER[reservedCard["bonus"]]} chip`);

    containerToInsertInto.appendChild($reservedCard);
}

export { renderOtherPlayers };
