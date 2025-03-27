import {setActionButtonState} from "../game-status-interface.js";
import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";

function selectCard(e) {
    const card = getCard(e)
    if (card) {
        setActionButtonState(
        "buy",
        "processBuyCardClick",
        {name: card.dataset.name, level: card.dataset.level},
        )
    }
}

function getCard(e) {
    return e.target.closest(".card")
}

function processBuyCardClick() {
    const cardName = document.querySelector(".action-button").dataset.name;
    const cardData = loadFromStorage("gameData")["market"]
}

export {selectCard, processBuyCardClick};