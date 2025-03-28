import { handlePaymentMethodChange, selectCard } from "./buy-handler.js";

function buyInit() {
    document.querySelectorAll(".decks")
            .forEach(deck => deck.addEventListener("click", selectCard));
    document.querySelector(".player-tokens").addEventListener("click", handlePaymentMethodChange);
}

export { buyInit };