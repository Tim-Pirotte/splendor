function hasReservePlace() {
    const amount = document.querySelectorAll("section .reserved-cards ul li").length;
    return amount < 4;
}

function deckHasEnoughCards() {}


export { hasReservePlace }