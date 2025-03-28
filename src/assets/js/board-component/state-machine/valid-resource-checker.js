function hasReservePlace() {
    const amount = document.querySelectorAll("section .reserved-cards ul li").length;
    return amount < 4;
}

function deckHasEnoughCards(level) {
    const amount = parseInt(document.querySelector(`.level-deck["${level}"] .cards-in-deck`).dataset.amount);
    return amount > 0;
}


export { hasReservePlace, deckHasEnoughCards };