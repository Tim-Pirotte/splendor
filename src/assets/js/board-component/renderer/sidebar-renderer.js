import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { formatNumber, insertImageInto, safeEmptyContainer } from "./helper.js";
import { TOKEN_MAPPER } from "../config.js";
import { MAX_PRESTIGE_POINTS } from "../../config.js";
import { getHighestScore } from "../../utils/game-object-handler.js";

function renderOtherPlayers(otherPlayers, gems) {
    const currentPlayerName = loadFromStorage("playerName");

    const $otherPlayerContainer = document.querySelector(".other-players");
    safeEmptyContainer($otherPlayerContainer);

    const $playerTemplate = document.querySelector("#other-player-card-template");

    const highestScore = getHighestScore(otherPlayers);

    for (const otherPlayer of otherPlayers) {
        if (otherPlayer.name !== currentPlayerName) {
            const $playerCard = $playerTemplate.content.firstElementChild.cloneNode(true);
            setPlayerName($playerCard, otherPlayer);
            setPlayerPoints($playerCard, otherPlayer["totalPrestigePoints"], highestScore);

            renderTokenList($playerCard.querySelector(".tokens"), otherPlayer["tokens"], gems);
            renderCardList($playerCard.querySelector(".cards"), otherPlayer["bonuses"], gems);
            renderReservedList($playerCard.querySelector(".reserved"), otherPlayer["reserve"]);

            $otherPlayerContainer.appendChild($playerCard);
        }
    }
}

function setPlayerName($playerCard, otherPlayer) {
    $playerCard.querySelector(".name").textContent = otherPlayer.name;
}

function setPlayerPoints($playerCard, prestigePoints, highestScore) {
    const $playerPoints = $playerCard.querySelector(".points span");
    $playerPoints.textContent = formatNumber(prestigePoints);

    if (prestigePoints >= MAX_PRESTIGE_POINTS) {
        $playerPoints.classList.add("enough-points-to-win");
    }

    if (prestigePoints >= highestScore) {
        insertImageInto($playerCard, "UI/tokens/white_chip", false, "Score amongst the highest");
    }
}

function renderTokenList(containerToInsertInto, tokenAmounts, gems) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");

    for (const gem of gems) {
        const $token = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
        $token.querySelector(".amount").textContent = tokenAmounts[gem] || 0;
        insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[gem]}_chip`, false, `${TOKEN_MAPPER[gem]} chip`);
        containerToInsertInto.appendChild($token);
    }
}

function renderCardList(containerToInsertInto, cardAmounts, gems) {
    const $numberedItemTemplate = document.querySelector("#numbered-item-template");

    for (const cardType of gems) {
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
        $reservedCard.querySelector(".amount").textContent = reservedCard["prestigePoints"];
        insertImageInto($reservedCard, `cards/empty/${TOKEN_MAPPER[reservedCard["bonus"]]}_empty_card`, false, `${TOKEN_MAPPER[reservedCard["bonus"]]} chip`);
        containerToInsertInto.appendChild($reservedCard);
    }
}

export { renderOtherPlayers };
