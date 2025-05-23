import { GEMS } from "../data.js";
import { TOKEN_MAPPER } from "../config.js";
import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import {
    formatNumber,
    getNumberedItemTemplate,
    highlightPointsWinner,
    getOrderedPlayersWithoutClientPlayer,
    isCreator,
} from "./helper.js";
import { determinePlayerAvatar, getHighestScore } from "../../utils/game-object-handler.js";
import { copyNode } from "../../utils/data-handler.js";
import { checkCompatibility } from "../../server-version-component/server-version.js";
import { insertImageInto, renderUnsupportedError } from "../../utils/renderer.js";

function renderOtherPlayers(players, currentPlayer) {
    const currentPlayerName = loadFromStorage("playerName");
    const highestScore = getHighestScore(players);

    const $otherPlayersContainer = document.querySelector(".other-players");

    const otherPlayers = getOrderedPlayersWithoutClientPlayer(players, currentPlayerName);

    if ($otherPlayersContainer.childElementCount === 1) setupRenderOtherPlayers(players.length);

    const $playerTemplate = document.querySelector("#other-player-card-template");

    for (const [index, $otherPlayer] of $otherPlayersContainer.querySelectorAll(":scope > li").entries()) {
        const playerName = otherPlayers[index].name;
        showOtherPlayerTurn(playerName, currentPlayer, $otherPlayer);

        $otherPlayer.innerHTML = renderOtherPlayer(
            $playerTemplate,
            otherPlayers[index],
            highestScore,
            isCreator(players, otherPlayers),
        ).innerHTML;
    }
}

function setupRenderOtherPlayers(amountOfPlayers) {
    const $otherPlayersContainer = document.querySelector(".other-players");

    for (let i = 0; i < amountOfPlayers - 1; i++) {
        const $li = document.createElement("li");
        $li.classList.add("player-card");
        $otherPlayersContainer.appendChild($li);
    }
}

function renderOtherPlayer($playerTemplate, otherPlayer, highestScore, isGameCreator) {
    const $playerCard = copyNode($playerTemplate);
    const avatar = determinePlayerAvatar(otherPlayer.name, otherPlayer.avatar);

    insertImageInto($playerCard.querySelector("header"), `avatars/${avatar}`, true, avatar);

    if (isGameCreator) $playerCard.querySelector("img").classList.add("game-creator");
    if (otherPlayer["forfeited"]) $playerCard.classList.add("forfeited");

    setPlayerName($playerCard, otherPlayer);
    setPlayerPoints($playerCard, otherPlayer["totalPrestigePoints"], highestScore, otherPlayer["forfeited"]);

    renderTokenList($playerCard.querySelector(".tokens"), otherPlayer["tokens"], GEMS);
    renderCardList($playerCard.querySelector(".cards"), otherPlayer["bonuses"], GEMS);
    renderReservedList($playerCard.querySelector(".reserved"), otherPlayer["reserve"]);

    return $playerCard;
}

function showOtherPlayerTurn(playerName, currentPlayer, $playerCard) {
    const playerCardAnimationDuration = 300;

    if (playerName === currentPlayer) {
        $playerCard.classList.add("current-player");
    } else {
        if ($playerCard.classList.contains("current-player")) $playerCard.classList.add("end-animation");
        $playerCard.classList.remove("current-player");
        setTimeout(removeCurrentPlayerClass, playerCardAnimationDuration);
    }

    function removeCurrentPlayerClass() {
        $playerCard.classList.remove("end-animation");
    }
}

function setPlayerName($playerCard, otherPlayer) {
    $playerCard.querySelector(".name").textContent = otherPlayer.name;
}

function setPlayerPoints($playerCard, prestigePoints, highestScore, hasForfeited) {
    const $playerPoints = $playerCard.querySelector(".points span");
    $playerPoints.textContent = formatNumber(prestigePoints);

    if (hasForfeited) return;

    highlightPointsWinner(prestigePoints, $playerPoints);

    if (prestigePoints >= highestScore) {
        insertImageInto($playerCard.querySelector("header"), "UI/diamond", false, "Score amongst the highest");

        $playerCard.querySelector("header picture:last-of-type img").classList.add("diamond");
    }
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

    insertImageInto($reservedCard, `UI/cards/${TOKEN_MAPPER[reservedCard["bonus"]]}_card_small`, false, `${TOKEN_MAPPER[reservedCard["bonus"]]} chip`);

    containerToInsertInto.appendChild($reservedCard);
}

function renderHistory(history) {
    checkCompatibility(2)
        .then(isCompatible => {
            if (!isCompatible) {
                renderIncompatibleServerMessage();
                return;
            }

            const $history = document.querySelector(".history");
            const historyPreviousLength = $history.querySelectorAll(":scope > li").length;
            const historyCurrentLength = history.length;
            const amountOfNewItems = historyCurrentLength - historyPreviousLength;

            if (!amountOfNewItems) return;

            for (const entry of history.slice(-amountOfNewItems)) {
                $history.insertAdjacentElement("afterbegin", renderHistoryEntry(entry));
            }
        });
}

const HISTORY_ACTIONS = {
    take: renderTakeTokensEntry,
    return: renderDiscardTokensEntry,
    buy: renderBuyCardEntry,
    reserve: renderReserveCardEntry,
    pickNoble: renderChooseNobleEntry,
    forfeit: renderForfeitEntry,
};

function renderHistoryEntry(entry) {
    const $renderedEntry = HISTORY_ACTIONS[entry["action"]](entry, entry["player"] );

    if (!$renderedEntry) return $renderedEntry;

    insertPlayerName($renderedEntry, entry["player"]);
    return $renderedEntry;
}

function renderTakeTokensEntry(entry, playerName) {
    const tokens = entry["tokens"];

    if (Object.keys(tokens).length === 0) {
        return renderSkipTurnHistory(playerName);
    }

    const $takeTokensEntry = copyNode(document.querySelector("#take-tokens-history-template"));

    renderHistoryTokenList(tokens, $takeTokensEntry);
    return $takeTokensEntry;
}

function renderDiscardTokensEntry(entry) {
    const $discardTokensEntry = copyNode(document.querySelector("#discard-tokens-history-template"));
    renderHistoryTokenList(entry["tokens"], $discardTokensEntry);
    return $discardTokensEntry;
}

function renderHistoryTokenList(tokens, $tokensEntry) {
    for (const [tokenType, amount] of Object.entries(tokens)) {
        $tokensEntry.insertAdjacentHTML("beforeend", `&nbsp${amount}`);
        insertImageInto($tokensEntry, `UI/tokens/${TOKEN_MAPPER[tokenType]}_chip`, false, `${TOKEN_MAPPER[tokenType]} chip`);
    }
}

function renderBuyCardEntry(entry) {
    const $buyCardEntry = copyNode(document.querySelector("#buy-card-history-template"));
    renderHistoryCard($buyCardEntry, entry["bonus"]);
    return $buyCardEntry;
}

function renderReserveCardEntry(entry) {
    const $reserveCardEntry = copyNode(document.querySelector("#reserve-card-history-template"));
    renderHistoryCard($reserveCardEntry, entry["bonus"]);
    return $reserveCardEntry;
}

function renderHistoryCard($cardEntry, cardType) {
    insertImageInto($cardEntry, `UI/cards/${TOKEN_MAPPER[cardType]}_card_small`, false, `${TOKEN_MAPPER[cardType]} card`);

    // &nbsp adds a space that doesn't get trimmed when rendering. This is needed since this text gets preceded by an image
    $cardEntry.insertAdjacentHTML("beforeend", "<p>&nbspcard</p>");
}

function renderChooseNobleEntry() {
    return copyNode(document.querySelector("#receive-noble-history-template"));
}

function renderForfeitEntry() {
    return copyNode(document.querySelector("#forfeit-history-template"));
}

function renderIncompatibleServerMessage() {
    const $history = document.querySelector(".history");
    renderUnsupportedError($history, "History");
}

function insertPlayerName(renderedEntry, playerName) {
    renderedEntry.querySelector("strong").textContent = playerName === loadFromStorage("playerName") ? "you" : playerName;
}

function renderSkipTurnHistory(playerName) {
    const $skipTurnHistory = copyNode(document.querySelector("#skip-turn-history-template"));

    $skipTurnHistory.querySelector("span").textContent = playerName === loadFromStorage("playerName") ? "your" : "their";

    return $skipTurnHistory;
}
export { renderOtherPlayers, renderHistory };
