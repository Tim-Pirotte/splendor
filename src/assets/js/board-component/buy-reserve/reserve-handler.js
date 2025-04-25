import * as API from "../../api.js";
import { endBuyReserveAction, getReserveCardButton } from "./helper.js";
import { startGameStatePolling } from "../game-data-handler.js";
import { deselectCard } from "./select.js";
import {getCardObject, validDeckReserve} from "../state-machine/valid-action-checker.js";
import { highlightCard, setActionToBuyReserve } from "./buy-handler.js";
import { addGoldToken, renderClientPlayerReserve } from "../renderer/current-player-renderer.js";
import {
    getActionButton,
    isCurrentlyPlaying,
    resetCurrentPlayer,
} from "../game-status-interface.js";
import {renderCard} from "../renderer/helper.js";
import {animateFromTo} from "../animation-component/animation-handler.js";
import {cardAnimation} from "../animation-component/data.js";

function processReserve(){
    resetCurrentPlayer();

    const selectedCardName = getReserveCardButton().dataset.name;
    const cardDeckLevel = getReserveCardButton().dataset.level;
    let requestBody;

    if (selectedCardName) {
        playCardToReservedAnimation(selectedCardName);

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

    API.reserveCard(requestBody).then(res => renderClientPlayerReserve(res["reserve"]));

    addGoldToken();
    endBuyReserveAction();
    startGameStatePolling();
}

function playCardToReservedAnimation(selectedCardName) {
    const $card = renderCard(getCardObject(selectedCardName));
    document.querySelector(".reserved-cards ul").appendChild($card);

    animateFromTo(document.querySelector(`[data-name="${selectedCardName}"]`), $card, cardAnimation);
}

function selectDeckForReserving(e) {
    if (!isCurrentlyPlaying()) return;

    const $clickedDeck = e.currentTarget;
    const $clickedCard = $clickedDeck.querySelector(".hidden-cards");
    const deckLevel = $clickedDeck.closest("li").dataset.deckLevel;
    const previousSelectedLevel = getReserveCardButton().dataset.level;

    if (previousSelectedLevel === deckLevel) {
        deselectCard(true);
        return;
    }

    highlightCard($clickedDeck);
    setActionToBuyReserve($clickedCard, false, validDeckReserve(deckLevel), deckLevel);

    getActionButton().disabled = true;
    getReserveCardButton().disabled = !validDeckReserve(deckLevel);
}

export { processReserve, selectDeckForReserving };
