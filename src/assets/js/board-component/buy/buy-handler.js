import {setActionButtonState} from "../game-status-interface.js";

function selectCard(e) {
    const card = getCard(e)
    if (card) {
        setActionButtonState("buy", "processBuyCardClick", {name: card.dataset.name})
    }
}

function getCard(e) {
    return e.target.closest(".card")
}

function processBuyCardClick() {
    console.log(document.querySelector(".action-button").dataset.name);
}

export {selectCard, processBuyCardClick};