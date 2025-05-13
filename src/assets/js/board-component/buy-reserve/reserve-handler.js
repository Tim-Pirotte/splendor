import * as API from "../../api.js";
import { endBuyReserveAction, getReserveCardButton } from "./helper.js";
import { startGameStatePolling } from "../game-data-handler.js";
import { deselectCard } from "./select.js";
import { validDeckReserve } from "../state-machine/valid-action-checker.js";
import { setActionToBuyReserve } from "./buy-handler.js";
import { addGoldToken, renderClientPlayerReserve } from "../renderer/current-player-renderer.js";
import {
    deselectAll,
    isCurrentlyPlaying,
    resetCurrentPlayer,
} from "../game-status-interface.js";

function processReserve(){
    resetCurrentPlayer();

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

    API.reserveCard(requestBody).then(res => renderClientPlayerReserve(res["reserve"]));

    addGoldToken();
    endBuyReserveAction();
    startGameStatePolling();
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
