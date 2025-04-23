import * as API from "../../api.js";
import { endBuyReserveAction, getReserveCardButton } from "./helper.js";
import { startGameStatePolling } from "../game-data-handler.js";
import { deselectCard } from "./select.js";
import { validDeckReserve } from "../state-machine/valid-action-checker.js";
import { highlightCard, setActionToBuyReserve } from "./buy-handler.js";
import { addGoldToken, renderClientPlayerReserve } from "../renderer/current-player-renderer.js";
import {
    clearDatasetAttributes,
    getActionButton,
    isCurrentlyPlaying,
    resetCurrentPlayer
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

    const $clickedPictureTag = e.currentTarget;
    const deckLevel = $clickedPictureTag.closest("li").dataset.deckLevel;
    const previousSelectedLevel = getReserveCardButton().dataset.level;

    console.log("jema")
    if (previousSelectedLevel === deckLevel) {
        deselectCard(true);
        return;
    }

    getReserveCardButton().classList.remove("hidden");

    highlightCard($clickedPictureTag);
    setActionToBuyReserve($clickedPictureTag.closest("li"), deckLevel, false, validDeckReserve(deckLevel));

    getActionButton().disabled = true;
    getReserveCardButton().disabled = !validDeckReserve(deckLevel);
}

function allowToReserve($card, deckLevel) {
    const $reserveCardButton = getReserveCardButton();

    clearDatasetAttributes($reserveCardButton);


    if (deckLevel) {
        $reserveCardButton.dataset.level = deckLevel;
    } else {
        $reserveCardButton.dataset.name = $card.dataset.name;
    }

    $reserveCardButton.classList.remove("hidden");
}

export { processReserve, selectDeckForReserving, allowToReserve };
