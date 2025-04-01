import { validCardReserve } from "../state-machine/valid-action-checker.js";
import { renderCard, safeEmptyContainer } from "../renderer/helper.js";
import * as API from "../../api.js"
import {getReserveCardButton} from "./helper.js";

function procesReserve(e){
    const selectedCardName = document.querySelector(".reserve-button").dataset.name;
    if( selectedCardName ) {
      const requestBody = {
            "development": {
              "name": selectedCardName
            }
          };
      API.reserveCard(requestBody).then(res => {
        //Render the card in the reserved space
        const $reservedCards = document.querySelector(".reserved-cards ul");
        safeEmptyContainer($reservedCards);
        for (const card of res["reserve"]) {
          renderCard($reservedCards, card["prestigePoints"], card["bonus"], card["cost"], card["name"]);
        }

        //TODO: delete the card from the deck
      }); 
    }

}

function isDeckReserve(){}

function allowToReserve() {
    getReserveCardButton().disabled = false;
}

export { procesReserve, allowToReserve };