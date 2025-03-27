import {setActionButtonState} from "../game-status-interface.js";
import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";

function selectCard(e) {
    const card = getCard(e)
    if (card) {
        setActionButtonState(
        "buy",
        "processBuyCardClick",
        {level: card.dataset.level, index: card.dataset.index},
        )
    }
}

function getCard(e) {
    return e.target.closest(".card")
}

function processBuyCardClick() {
    const $actionButton = document.querySelector(".action-button");
    const cardName = $actionButton.dataset.name;
    const level = $actionButton.dataset.level;
    const cardData = loadFromStorage("gameData")["market"][parseInt(level) - 1];
}

export {selectCard, processBuyCardClick};