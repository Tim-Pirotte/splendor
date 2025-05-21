import * as API from "../../api.js";
import { endBuyReserveAction, getReserveCardButton } from "./helper.js";
import { startGameStatePolling } from "../game-data-handler.js";
import { deselectCard } from "./select.js";
import { getCardObject, validDeckReserve } from "../state-machine/valid-action-checker.js";
import { highlightCard, setActionToBuyReserve } from "./buy-handler.js";
import { addGoldToken } from "../renderer/current-player-renderer.js";
import { validDeckReserve } from "../state-machine/valid-action-checker.js";
import { setActionToBuyReserve } from "./buy-handler.js";
import { addGoldToken, renderClientPlayerReserve } from "../renderer/current-player-renderer.js";
import {
    deselectAll,
    isCurrentlyPlaying,
    resetCurrentPlayer,
} from "../game-status-interface.js";
import { renderCard } from "../renderer/helper.js";
import { animateFromTo } from "../animation-component/animation-handler.js";
import {
    reserveCardAnimation, reserveCardFromDeckAnimationBack, reserveCardFromDeckAnimationFront,
    setAnimationDelayBeforePolling,
} from "../animation-component/data.js";
import {removeBackFromCard} from "../renderer/board-renderer.js";

function processReserve(){
    resetCurrentPlayer();

    const selectedCardName = getReserveCardButton().dataset.name;
    const cardDeckLevel = getReserveCardButton().dataset.level;
    let requestBody;

    if (selectedCardName) {
        playCardToReservedAnimation(selectedCardName);
        setAnimationDelayBeforePolling(reserveCardAnimation.duration);

        requestBody = {
            "development": {
                "name": selectedCardName,
            },
        };
    } else {
        requestBody = {
            "development": {
                "level": parseInt(cardDeckLevel),
            },
        };
    }

    API.reserveCard(requestBody).then(res => {
        if (!selectedCardName) {
            playDeckToReservedAnimation(cardDeckLevel, res["reserve"][res["reserve"].length - 1]);
        }
    });

    addGoldToken();
    endBuyReserveAction();

    startGameStatePolling();
}

function playCardToReservedAnimation(selectedCardName) {
    const $source = document.querySelector(`[data-name="${selectedCardName}"]`);
    $source.classList.add("hidden");

    document.querySelector(".reserved-cards h4").textContent = "";

    const $card = renderCard(getCardObject(selectedCardName));
    document.querySelector(".reserved-cards ul").appendChild($card);

    animateFromTo($source, $card, reserveCardAnimation);
}

function playDeckToReservedAnimation(deckLevel, cardData) {
    const $source = document.querySelector(`[data-deck-level="${deckLevel}"] .hidden-cards`);

    document.querySelector(".reserved-cards h4").textContent = "";

    const $card = renderCard(cardData);
    const $reservedCards = document.querySelector(".reserved-cards ul");
    const $cardSidesContainer = document.createElement("div");
    $cardSidesContainer.appendChild($card);
    const $cardBack = $source.cloneNode(true);
    $cardSidesContainer.appendChild($cardBack);
    $reservedCards.appendChild($cardSidesContainer);

    animateFromTo($source, $card, reserveCardFromDeckAnimationFront, removeBackFromCard);
    animateFromTo($source, $cardBack, reserveCardFromDeckAnimationBack);
}

function selectDeckForReserving(e) {
    if (!isCurrentlyPlaying()) return;

    const $clickedDeck = e.currentTarget;
    const deckLevel = $clickedDeck.closest("li").dataset.deckLevel;
    const previousSelectedLevel = getReserveCardButton().dataset.level;

    deselectAll();

    if (previousSelectedLevel === deckLevel) return;

    setActionToBuyReserve($clickedDeck, false, validDeckReserve(deckLevel), deckLevel);
}

export { processReserve, selectDeckForReserving };
