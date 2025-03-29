import { validCardReserve } from "../state-machine/valid-action-checker.js";
import * as API from "./../../api.js"

function selectCardForReserve(e) {
    const $selectedCard = e.target.closest("li");
    const cardName = $selectedCard.dataset.name;
    if(validCardReserve()) {
      // Add the name data to the button
      console.log($selectedCard.dataset)

      //console.log(cardName)
      document.querySelector(".reserve-button").dataset.name = cardName;
    }
}


function procesReserve(e){
  console.log(document.querySelector(".reserve-button").dataset.name)
    // const requestBody = {
    //     "development": {
    //       "name": cardName
    //     }
    //   };
    
    // console.log(cardName);
    //API.reserveCard(requestBody);
}

function isDeckReserve(){}

export { selectCardForReserve, procesReserve };