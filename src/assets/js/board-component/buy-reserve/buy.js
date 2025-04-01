import { handlePaymentMethodChange } from "./buy-handler.js";
import {procesReserve, selectCardForReserve} from "./reserve-handler";
import {selectCard} from "./select";

function buyReserveInit() {
    document.querySelectorAll(".decks")
        .forEach(deck => deck.addEventListener("click", selectCard));
    document.querySelector(".player-tokens").addEventListener("click", handlePaymentMethodChange);
    document.querySelector(".reserve-button").addEventListener("click", procesReserve);
}

export { buyReserveInit };