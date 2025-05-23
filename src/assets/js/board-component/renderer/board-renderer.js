import { GEMS } from "../data.js";
import {
    CARDS_IN_DECK_TO_DECK_HEIGHT_OFFSET,
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
import {copyNode, getAmountOfTemplateTags} from "../../utils/data-handler.js";
import { insertImageInto } from "../../utils/renderer.js";
import { validCardBuy, validNobelPick } from "../state-machine/valid-action-checker.js";
import { canSelectNoble } from "../nobles/nobles-handler.js";
import { animateFromTo } from "../animation-component/animation-handler.js";
import {
    cardMarketFadeAnimation, getAnimationDelayBeforePolling,
    reserveCardFromDeckAnimationBack,
    reserveCardFromDeckAnimationFront,
    setAnimationDelayBeforePolling,
} from "../animation-component/data.js";

function renderCards(market) {
    for (const deck of market) {
        const $currentDeck = getDeck(deck);

        setAmountOfCardsInDeck($currentDeck, deck);

        if ($currentDeck.children.length === 0) addNodesToEmptiedContainer($currentDeck, deck["visibleCards"], renderCard);

        renderDeck($currentDeck, deck);
    }
}

function renderDeck($currentDeck, deck) {
    for (const [index, $previousCard] of $currentDeck.querySelectorAll(":scope > li").entries()) {
        updateCard(deck, index, $previousCard);
    }
}

function updateCard(deck, index, $previousCard) {
    const cardData = deck["visibleCards"][index];

    if (!cardData) return;

    if ($previousCard.dataset.name === cardData["name"]) {
        $previousCard.classList.toggle(
            `${TOKEN_MAPPER[cardData["bonus"]]}-buyable-card`,
            validCardBuy(cardData["name"]),
        );

        return;
    }

    playCardFadeAnimation($previousCard, deck, cardData);
}

function playCardFadeAnimation($previousCard, deck, cardData) {
    setAnimationDelayBeforePolling(
        reserveCardFromDeckAnimationFront.duration + cardMarketFadeAnimation.duration,
    );

    const animationPlayer = $previousCard.animate(
        cardMarketFadeAnimation.keyFrames,
        {
            duration: cardMarketFadeAnimation.duration,
            easing: cardMarketFadeAnimation.easeFunction,
        },
    );

    animationPlayer.addEventListener(
        "finish",
        () => animateNewCard(deck, cardData, $previousCard),
    );
}

function animateNewCard(deck, cardData, $previousCard) {
    const $source = document.querySelector(`.level-${deck["level"]} picture`);

    const $newCard = renderCard(cardData);
    const $cardSidesContainer = document.createElement("div");
    $cardSidesContainer.appendChild($newCard);
    const $cardBack = $source.cloneNode(true);
    $cardSidesContainer.appendChild($cardBack);
    // outerHTML makes a copy of the nodes outerHTML attribute so you don't have a reference to the node in the DOM.
    // I am using replaceWith because then I don't have to query the card again to get a new reference.
    $previousCard.replaceWith($cardSidesContainer);
    animateFromTo($source, $newCard, reserveCardFromDeckAnimationFront, removeBackFromCard);
    animateFromTo($source, $cardBack, reserveCardFromDeckAnimationBack);
}

function removeBackFromCard($target) {
    $target.closest("div").outerHTML = $target.outerHTML;
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
    $hiddenCard.closest("picture").classList.toggle("hidden", amountOfCardsInDeck === 0);
    $hiddenCard.style.transform = `translateY(${-(amountOfCardsInDeck / CARDS_IN_DECK_TO_DECK_HEIGHT_SCALE) + CARDS_IN_DECK_TO_DECK_HEIGHT_OFFSET}rem)`;
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

    if ($noblesContainer.children.length === getAmountOfTemplateTags($noblesContainer)) {
        addNodesToEmptiedContainer($noblesContainer, unclaimedNobles, renderNoble);
        return;
    }

    let index = 0;
    for (const $noble of $noblesContainer.querySelectorAll(":scope > li")) {
        if ($noble.dataset.name !== unclaimedNobles[index]["name"]) {
            $noble.classList.add("shrink");
            setAnimationDelayBeforePolling(getAnimationDelayBeforePolling()  + 1000);
            setTimeout(() => $noble.outerHTML = "", 1000);
        } else {
            index++;
        }
    }
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

export { renderCards, renderBoardTokens, renderNobles, renderUpdatedBoardTokens, removeBackFromCard };
