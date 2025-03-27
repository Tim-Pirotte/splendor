import {selectCard} from "./buy-handler.js";

function buyInit() {
    document.querySelectorAll(".decks")
            .forEach(deck => {deck.addEventListener("click", selectCard)});
}

export {buyInit};