import { renderCard, safeEmptyContainer } from "../renderer/helper.js";
import * as API from "../../api.js"
import {finishRoundAfterBuyReserve, getReserveCardButton} from "./helper.js";
import {startGameStatePolling} from "../game-data-handler.js";
import {HIGHEST_CARD_LEVEL} from "../config.js";

function processReserve(e){
    const selectedCardName = getReserveCardButton().dataset.name;
    //TODO: check if this if statement is needed, reserve button should be disabled if you can't reserve
    if( selectedCardName ) {
      const requestBody = {
            "development": {
              "name": selectedCardName
            }
          };
      API.reserveCard(requestBody).then(res => renderReservedCards(res["reserve"]));

      finishRoundAfterBuyReserve();
      startGameStatePolling();
    }

}

function renderReservedCards(reservedCards) {
    const $reservedCards = document.querySelector(".reserved-cards ul");
    safeEmptyContainer($reservedCards);

    for (const card of reservedCards["reserve"]) {
        renderCard($reservedCards, card["prestigePoints"], card["bonus"], card["cost"], card["name"], true);
    }
}

function reserveCardByLevel(e) {
    const closestPictureTag = e.target.closest("picture");
    if (!(closestPictureTag && closestPictureTag.classList.contains("hidden-deck"))) return;
    const level = getDeckLevel(e.target)
}

function getDeckLevel(target) {
    const deck = target.closest(".deck");
    for (let i = 1; i <= HIGHEST_CARD_LEVEL; i++) {
        if (target.closest("li").classList.contains(`level-${i}`)) {
            return i;
        }
    }
}

function allowToReserve() {
    getReserveCardButton().disabled = false;
}

export { processReserve, allowToReserve, reserveCardByLevel };