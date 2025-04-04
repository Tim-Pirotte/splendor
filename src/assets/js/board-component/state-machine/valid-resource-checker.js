import { MAX_RESERVED_AMOUNT } from "../config.js";

function hasReservePlace() {
    const amount = document.querySelectorAll(".reserved-cards .card").length;
    return amount < MAX_RESERVED_AMOUNT;
}

function deckHasEnoughCards(deckLevel) {
    const amount = parseInt(document.querySelector(`.decks .level-${deckLevel} ul.cards-in-deck`).dataset.amount);
    return amount > 0;
}

export { hasReservePlace, deckHasEnoughCards };
