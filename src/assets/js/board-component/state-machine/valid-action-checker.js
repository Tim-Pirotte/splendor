import { isCurrentlyPlaying } from "../game-status-interface.js";
import { deckHasEnoughCards, hasReservePlace } from "./valid-resource-checker.js";
import { DEVELOPMENT_CARDS } from "../data.js";
import { GAME_STATE } from "./data.js";

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

function validDeckReserve(cardName) {
    return isCurrentlyPlaying() && getGameState() === GAME_STATE.TURN_ACTION && hasReservePlace() && deckHasEnoughCards(getLevelFromCard(cardName));
}

function validNobelPick() {
    return isCurrentlyPlaying() && getGameState() === GAME_STATE.CHOOSE_NOBEL;
}

function getGameState(){
    return sessionStorage.getItem("gameState");
}

function getLevelFromCard(cardName) {
    const card = getCardObject(cardName);
    return card.level;
}

function getCardObject(cardName) {
    return DEVELOPMENT_CARDS.find(card => card.name === cardName);
}

export { validTokenTake, validTokenDiscard, validCardBuy, validCardReserve, validDeckReserve, validNobelPick };
