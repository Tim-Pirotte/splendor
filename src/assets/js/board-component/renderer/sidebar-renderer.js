import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import {
    formatNumber,
    getNumberedItemTemplate,
    insertImageInto,
    safeEmptyContainer,
    selectCurrentlyPlayingPlayersCard,
} from "./helper.js";
import { TOKEN_MAPPER } from "../config.js";
import { MAX_PRESTIGE_POINTS } from "../../config.js";
import { getHighestScore } from "../../utils/game-object-handler.js";
import { copyNode } from "../../utils/data-handler.js";
import { avatars } from "../../main-menu-component/data.js";
import {isV2Server} from "../../server-version-component/server-version.js";

function renderOtherPlayers(otherPlayers, gems) {
    const currentPlayerName = loadFromStorage("playerName");

    const $otherPlayerContainer = document.querySelector(".other-players");
    safeEmptyContainer($otherPlayerContainer);

    const $playerTemplate = document.querySelector("#other-player-card-template");

    const highestScore = getHighestScore(otherPlayers);

    for (const otherPlayer of otherPlayers) {
        if (otherPlayer.name !== currentPlayerName) {
            const $playerCard = copyNode($playerTemplate);
            const playerName = otherPlayer.name;
            const avatar = avatars[playerName.toLowerCase().charCodeAt(0) % avatars.length];

            selectCurrentlyPlayingPlayersCard(playerName,$playerCard);
            setPlayerName($playerCard, otherPlayer);
            insertImageInto($playerCard, `avatars/${avatar}`, true, avatar);
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
    const $numberedItemTemplate = getNumberedItemTemplate();

    for (const gem of gems) {
        const $token = copyNode($numberedItemTemplate);
        $token.querySelector(".amount").textContent = tokenAmounts[gem] || 0;
        insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[gem]}_chip`, false, `${TOKEN_MAPPER[gem]} chip`);
        containerToInsertInto.appendChild($token);
    }
}

function renderCardList(containerToInsertInto, cardAmounts, gems) {
    const $numberedItemTemplate = getNumberedItemTemplate();

    for (const cardType of gems) {
        if (cardType !== "Gold") {
            const $card = copyNode($numberedItemTemplate);
            $card.querySelector(".amount").textContent = cardAmounts[cardType] || 0;
            insertImageInto($card, `UI/cards/${TOKEN_MAPPER[cardType]}_card_small`, false, `${TOKEN_MAPPER[cardType]} card`);
            containerToInsertInto.appendChild($card);
        }
    }
}

function renderReservedList(containerToInsertInto, reservedCards) {
    const $numberedItemTemplate = getNumberedItemTemplate();

    for (const reservedCard of reservedCards) {
        const $reservedCard = copyNode($numberedItemTemplate);
        $reservedCard.querySelector(".amount").textContent = reservedCard["prestigePoints"];
        insertImageInto($reservedCard, `cards/empty/${TOKEN_MAPPER[reservedCard["bonus"]]}_empty_card`, false, `${TOKEN_MAPPER[reservedCard["bonus"]]} chip`);
        containerToInsertInto.appendChild($reservedCard);
    }
}

function renderHistory() {
    if (!isV2Server()) incompatibleServerMessage();
}

function incompatibleServerMessage() {
    const $history = document.querySelector(".history");
    $history.outerHTML = "<p>History is not supported on this server. Sorry for the Inconvenience.</p>"
}

export { renderOtherPlayers, renderHistory };
