import { validCardReserve } from "../state-machine/valid-action-checker.js";
import * as API from "./../../api.js"

function selectCardForReserve(e) {
    const $selectedCard = e.target.closest("li");
    if(validCardReserve()) {
        const cardName = $selectedCard.dataset.name;
        procesReserve(cardName);
    }
    console.log($selectedCard);
}


function procesReserve(cardName){
    const requestBody = {
        "development": {
          "name": cardName
        }
      };
    
    console.log(cardName);
    //API.reserveCard(requestBody);
}

function isDeckReserve(){}

export { selectCardForReserve };