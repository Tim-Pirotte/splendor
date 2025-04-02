import { handlePaymentMethodChange } from "./buy-handler.js";
import {processReserve, selectDeckForReserving} from "./reserve-handler.js";
import {selectCard} from "./select.js";

function buyReserveInit() {
    document.querySelectorAll(".decks")
        .forEach(deck => {
            deck.addEventListener("click", selectCard);
            deck.addEventListener("click", selectDeckForReserving);
        });
    document.querySelector(".player-tokens").addEventListener("click", handlePaymentMethodChange);
    document.querySelector(".reserve-button").addEventListener("click", processReserve);
    document.querySelector(".reserved-cards ul").addEventListener("click", selectCard);
}

export { buyReserveInit };