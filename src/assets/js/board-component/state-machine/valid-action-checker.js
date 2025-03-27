import { isCurrentlyPlaying } from "../game-status-interface.js";
import { GameState } from "./data.js";

function validTokenTake() {
    return isCurrentlyPlaying() && getGameState() === GameState.TURN_ACTION;
}

function validTokenDiscard() {
    return isCurrentlyPlaying() && getGameState() === GameState.RETURN_GEMS;
}

function validCardBuy() {
    return isCurrentlyPlaying() && getGameState() === GameState.TURN_ACTION;
}

function validCardReserve() {
    return isCurrentlyPlaying() && getGameState() === GameState.TURN_ACTION && hasReservePlace();
}

function validDeckReserve() { //TODO: check if the deck is empty
    return isCurrentlyPlaying() && getGameState() === GameState.TURN_ACTION && hasReservePlace();
}

function validNobelPick() {
    return isCurrentlyPlaying() && getGameState() === GameState.CHOOSE_NOBEL;
}

function hasReservePlace() {
    const amount = document.querySelectorAll("section .reserved-cards ul li").length;
    return amount < 4;
}


function getGameState(){
    return sessionStorage.getItem("gameState");
}

export { validTokenTake, validTokenDiscard, validCardBuy, validCardReserve, validDeckReserve, validNobelPick };