import { updateGameData } from "./game-data-handler.js";
import { initGameStatusInterface } from "./game-status-interface.js";
import { selectToken } from "./token/token-handler.js";
import { selectNoble } from "./nobles/nobles-handler.js";
import { selectCard } from "./buy-reserve/select.js";
import { processReserve, selectDeckForReserving } from "./buy-reserve/reserve-handler.js";
import { handlePaymentMethodChange } from "./buy-reserve/buy-handler.js";

function init() {
    updateGameData();
    initGameStatusInterface();
    initializeActions();
}

function initializeActions() {
    tokenInit();
    noblesInit();
    buyReserveInit();
}

function tokenInit(){
    document.querySelector(".board-tokens").addEventListener("click", selectToken);
}

function noblesInit() {
    document.querySelector(".nobles").addEventListener("click", selectNoble);
}

function buyReserveInit() {
    document.querySelectorAll(".decks")
        .forEach(deck => {
            deck.addEventListener("click", selectCard);
            deck.addEventListener("click", selectDeckForReserving);
        });
    document.querySelector(".player-tokens").addEventListener("click", handlePaymentMethodChange);
    document.querySelector(".reserve-button").addEventListener("click", processReserve);
    document.querySelector(".reserved-cards ul").addEventListener("click", selectCard);
}

init();
