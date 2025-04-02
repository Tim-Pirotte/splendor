import { renderCard, safeEmptyContainer } from "../renderer/helper.js";
import * as API from "../../api.js";
import {finishRoundAfterBuyReserve, getReserveCardButton} from "./helper.js";
import {startGameStatePolling} from "../game-data-handler.js";
import {HIGHEST_CARD_LEVEL} from "../config.js";
import {getActionButton, setActionButtonState} from "../game-status-interface.js";
import {deselectCard} from "./select.js";
import {validDeckReserve} from "../state-machine/valid-action-checker.js";

function processReserve(){
    const selectedCardName = getReserveCardButton().dataset.name;
    const cardDeckLevel = getReserveCardButton().dataset.level;
    let requestBody;
    if( selectedCardName ) {
      requestBody = {
            "development": {
              "name": selectedCardName
            }
          };

    } else {
        requestBody = {
            "development": {
                "level": parseInt(cardDeckLevel)
            }
        };
    }
    API.reserveCard(requestBody).then(res => renderReservedCards(res["reserve"]));

    finishRoundAfterBuyReserve();
    startGameStatePolling();

}

function renderReservedCards(reservedCards) {
    const $reservedCards = document.querySelector(".reserved-cards ul");
    safeEmptyContainer($reservedCards);

    for (const card of reservedCards) {
        renderCard($reservedCards, card["prestigePoints"], card["bonus"], card["cost"], card["name"], true);
    }
}

function selectDeckForReserving(e) {

    const $closestPictureTag = e.target.closest("picture");
    if (!$closestPictureTag) return;
    if (!$closestPictureTag.classList.contains("hidden-deck")) return;

    const deckLevel = getDeckLevel(e.target);
    if (!validDeckReserve(deckLevel)) return;

    const previousSelectedLevel = parseInt(getReserveCardButton().dataset.level);
    deselectCard();

    if (previousSelectedLevel === deckLevel) {
        setActionButtonState("skip turn", "skipTurn", {}, true);
        return;
    }

    deselectCard();
    getReserveCardButton().disabled = false;
    if (getReserveCardButton().dataset.name) getReserveCardButton().removeAttribute("data-name");
    setActionButtonState(
    "buy",
    "processBuyCardClick",
    {},
    );
    getActionButton().disabled = true;
    getReserveCardButton().dataset.level = deckLevel;
    getReserveCardButton().classList.remove("hidden");
    $closestPictureTag.classList.add("selected-card");
}

function getDeckLevel(target) {
    for (let i = 1; i <= HIGHEST_CARD_LEVEL; i++) {
        if (target.closest("li").classList.contains(`level-${i}`)) {
            return i;
        }
    }
}

function allowToReserve() {
    getReserveCardButton().disabled = false;
}

export { processReserve, allowToReserve, selectDeckForReserving };