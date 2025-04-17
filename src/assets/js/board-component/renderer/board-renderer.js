import { GEMS } from "../data.js";
import {
    CARDS_IN_DECK_TO_DECK_HEIGHT_SCALE,
    GOLD_TOKEN_LIMIT,
    NOBLES_MAPPER,
    TOKEN_LIMIT,
    TOKEN_LIMIT_THREE_PLAYERS,
    TOKEN_LIMIT_TWO_PLAYERS,
    TOKEN_MAPPER,
} from "../config.js";
import {
    addNodesToEmptiedContainer,
    constructVerticalBackground,
    getNumberedItemTemplate,
    renderCard,
    safeEmptyContainer,
} from "./helper.js";
import { getUnclaimedTokens, sumObjectValues } from "../helper.js";
import { copyNode } from "../../utils/data-handler.js";
import { insertImageInto } from "../../utils/renderer.js";
import { validNobelPick } from "../state-machine/valid-action-checker.js";
import { canSelectNoble } from "../nobles/nobles-handler.js";

function renderCards(market) {
    for (const deck of market) {
        const $currentDeck = getDeck(deck);

        setAmountOfCardsInDeck($currentDeck, deck);
        addNodesToEmptiedContainer($currentDeck, deck["visibleCards"], renderCard);
    }
}

function getDeck(deck) {
    return document.querySelector(`.level-${deck["level"]} .cards-in-deck`);
}

function setAmountOfCardsInDeck($currentDeck, deck) {
    $currentDeck.dataset.amount = deck["cardStackSize"];
    renderDeckSize($currentDeck, deck["cardStackSize"]);
}

function renderDeckSize($currentDeck, amountOfCardsInDeck) {
    const $hiddenCard = $currentDeck.closest("li").querySelector(":scope > picture img");
    $hiddenCard.style.transform = `translateY(-${amountOfCardsInDeck / CARDS_IN_DECK_TO_DECK_HEIGHT_SCALE}rem)`;
}

function getMaxTokens(playerLength, tokenType) {
    const twoPlayers = 2;
    const threePlayers = 3;

    if (tokenType === "Gold") return GOLD_TOKEN_LIMIT;
    if (playerLength === twoPlayers) { return TOKEN_LIMIT_TWO_PLAYERS; }
    else if (playerLength === threePlayers) { return TOKEN_LIMIT_THREE_PLAYERS; }
    else { return TOKEN_LIMIT; }
}

function renderBoardTokens(unclaimedTokens, playerLength) {
    const $boardTokensContainer = document.querySelector(".board-tokens");
    safeEmptyContainer($boardTokensContainer);

    const $numberedItemTemplate = getNumberedItemTemplate();

    for (const token of GEMS.toReversed()) {
        $boardTokensContainer.appendChild(renderBoardToken($numberedItemTemplate, token, unclaimedTokens, playerLength));
    }
}

function renderBoardToken($numberedItemTemplate, token, unclaimedTokens, playerLength) {
    const $boardToken = copyNode($numberedItemTemplate);

    $boardToken.dataset.type = token;
    $boardToken.dataset.amount = unclaimedTokens[token] || 0;

    const maxTokens = getMaxTokens(playerLength, token);

    $boardToken.querySelector(".amount").innerHTML = `${(unclaimedTokens[token] || 0)}/${maxTokens} <span></span>`;
    $boardToken.style.background = constructVerticalBackground(unclaimedTokens[token] || 0, `board_token_${TOKEN_MAPPER[token]}`, 0.5);
    $boardToken.style.backgroundSize = "3.25rem";

    return $boardToken;
}

function getNobleAlt(costs) {
    let alt = "Noble (+3 pts.) | Cost: ";

    for (const [tokenType, amount] of Object.entries(costs)) alt += `${TOKEN_MAPPER[tokenType]}: ${amount} `;

    return alt;
}

function renderNobles(unclaimedNobles) {
    const $noblesContainer = document.querySelector(".nobles");
    addNodesToEmptiedContainer($noblesContainer, unclaimedNobles, renderNoble);
}

function renderNoble(noble) {
    const $noble = copyNode(document.querySelector("#noble-template"));
    $noble.dataset.name = noble["name"];

    insertImageInto($noble, `nobles/${NOBLES_MAPPER[noble.name]}`, false, getNobleAlt(noble["neededBonuses"]));

    if (validNobelPick() && canSelectNoble(noble["name"])) $noble.classList.add("selectable-noble");

    return $noble;
}

function renderUpdatedBoardTokens(tokensToAdd) {
    const clientPlayer = 1;
    const amountOfPlayers = document.querySelectorAll(".player-card").length + clientPlayer;
    const previousTokens = getUnclaimedTokens();
    const newAmountsOfTokens = sumObjectValues(previousTokens, tokensToAdd);

    renderBoardTokens(newAmountsOfTokens, amountOfPlayers);
}

export { renderCards, renderBoardTokens, renderNobles, renderUpdatedBoardTokens };
