import { isCurrentlyPlaying } from "../game-status-interface.js";

function validTokenTake() {
    return isCurrentlyPlaying();
}

function validTokenDiscard() {
    return isCurrentlyPlaying();
}

function validCardBuy() {
    return isCurrentlyPlaying();
}

function validCardReserve() {
    return isCurrentlyPlaying();
}

function validDeckReserve() {
    return isCurrentlyPlaying();
}

function validNobelPick() {
    return isCurrentlyPlaying();
}

export { validTokenTake, validTokenDiscard, validCardBuy, validCardReserve, validDeckReserve, validNobelPick };