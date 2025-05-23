import { updateGameData } from "./game-data-handler.js";
import { initGameStatusInterface } from "./game-status-interface.js";
import { selectToken } from "./tokens/token-handler.js";
import { selectNoble } from "./nobles/nobles-handler.js";
import { selectCard } from "./buy-reserve/select.js";
import { processReserve, selectDeckForReserving } from "./buy-reserve/reserve-handler.js";
import { handlePaymentMethodChange } from "./buy-reserve/buy-handler.js";
import { selectPlayerToken } from "./tokens/discard.js";
import * as API from "../api.js";
import { handleKeyPress } from "./action-registry.js";
import { effects, soundInit } from "../sound-component/sound.js";

function init() {
    updateGameData();
    initGameStatusInterface();
    initializeActions();
    setupSound();
}

function setupSound() {
    soundInit();

    document.querySelectorAll(".button-container button, .forfeit")
        .forEach(button => {
            button.addEventListener("click", effects.playClick);
        });
}

function initializeActions() {
    tokenInit();
    noblesInit();
    buyReserveInit();
    forfeitInit();
    enterButtonInit();
}

function tokenInit() {
    document.querySelector(".board-tokens").addEventListener("click", selectToken);
    document.querySelector(".player-tokens ul").addEventListener("click", selectPlayerToken);
}

function noblesInit() {
    document.querySelector(".nobles").addEventListener("click", selectNoble);
}

function buyReserveInit() {
    document.querySelectorAll(".cards-in-deck")
        .forEach((cards) => cards.addEventListener("click", selectCard));
    document.querySelectorAll(".hidden-cards")
        .forEach((cards) => cards.addEventListener("click", selectDeckForReserving));
    document.querySelector(".player-tokens").addEventListener("click", handlePaymentMethodChange);
    document.querySelector(".reserve-button").addEventListener("click", processReserve);
    document.querySelector(".reserved-cards ul").addEventListener("click", selectCard);
}

function forfeitInit() {
    document.querySelector(".forfeit").addEventListener("click", API.leaveGame);
}

function enterButtonInit() {
    document.addEventListener("keydown", handleKeyPress);
}

init();