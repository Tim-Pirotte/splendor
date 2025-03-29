const MAX_RESERVED_AMOUNT = 3;

function hasReservePlace() {
    const amount = document.querySelectorAll(".reserved-cards .card").length;
    return amount < MAX_RESERVED_AMOUNT;
}

function deckHasEnoughCards(level) {
    const amount = parseInt(document.querySelector(`.level-deck[data-amount="${level}"] .cards-in-deck`).dataset.amount);
    return amount > 0;
}

export { hasReservePlace, deckHasEnoughCards };
