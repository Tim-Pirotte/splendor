import * as API from "../../api.js";
import { addNodesToEmptiedContainer, renderCard } from "../renderer/helper.js";
import { endBuyReserveAction, getReserveCardButton } from "./helper.js";
import { startGameStatePolling } from "../game-data-handler.js";
import { deselectCard } from "./select.js";
import { validDeckReserve } from "../state-machine/valid-action-checker.js";
import { highlightCard, setActionToBuyReserve } from "./buy-handler.js";
import { addGoldToken } from "../renderer/current-player-renderer.js";
import { getActionButton, isCurrentlyPlaying } from "../game-status-interface.js";

function processReserve(){
    const selectedCardName = getReserveCardButton().dataset.name;
    const cardDeckLevel = getReserveCardButton().dataset.level;
    let requestBody;

    if( selectedCardName ) {
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

    API.reserveCard(requestBody).then(res => renderReservedCards(res["reserve"]));

    addGoldToken();
    endBuyReserveAction();
    startGameStatePolling();
}

function renderReservedCards(reservedCards) {
    const $reservedCards = document.querySelector(".reserved-cards ul");
    addNodesToEmptiedContainer($reservedCards, reservedCards, renderCard);
}

function selectDeckForReserving(e) {
    if (!isCurrentlyPlaying()) return;

    const $clickedPictureTag = e.currentTarget;
    const deckLevel = $clickedPictureTag.closest("li").dataset.deckLevel;
    const previousSelectedLevel = getReserveCardButton().dataset.level;

    if (previousSelectedLevel === deckLevel) {
        deselectCard(true);
        return;
    }

    getReserveCardButton().classList.remove("hidden");

    highlightCard($clickedPictureTag);
    setActionToBuyReserve($clickedPictureTag.closest("li"), deckLevel);

    getActionButton().disabled = true;
    getReserveCardButton().disabled = !validDeckReserve(deckLevel);
}

export { processReserve, selectDeckForReserving };
