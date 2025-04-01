import { handlePaymentMethodChange } from "./buy-handler.js";
import {procesReserve} from "./reserve-handler.js";
import {selectCard} from "./select.js";

function buyReserveInit() {
    document.querySelectorAll(".decks")
        .forEach(deck => deck.addEventListener("click", selectCard));
    document.querySelector(".player-tokens").addEventListener("click", handlePaymentMethodChange);
    document.querySelector(".reserve-button").addEventListener("click", procesReserve);
}

export { buyReserveInit };