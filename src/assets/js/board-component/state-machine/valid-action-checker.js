import { isCurrentlyPlaying } from "../game-status-interface.js";
import { GAME_STATE } from "./data.js";
import { hasReservePlace } from "./valid-resource-checker.js";

function validTokenTake() {
    return isCurrentlyPlaying() && getGameState() === GAME_STATE.TURN_ACTION;
}

function validTokenDiscard() {
    return isCurrentlyPlaying() && getGameState() === GAME_STATE.RETURN_GEMS;
}

function validCardBuy() {
    return isCurrentlyPlaying() && getGameState() === GAME_STATE.TURN_ACTION;
}

function validCardReserve() {
    return isCurrentlyPlaying() && getGameState() === GAME_STATE.TURN_ACTION && hasReservePlace();
}

function validDeckReserve() { //TODO: check if the deck is empty
    return isCurrentlyPlaying() && getGameState() === GAME_STATE.TURN_ACTION && hasReservePlace();
}

function validNobelPick() {
    return isCurrentlyPlaying() && getGameState() === GAME_STATE.CHOOSE_NOBEL;
}

function getGameState(){
    return sessionStorage.getItem("gameState");
}

export { validTokenTake, validTokenDiscard, validCardBuy, validCardReserve, validDeckReserve, validNobelPick };