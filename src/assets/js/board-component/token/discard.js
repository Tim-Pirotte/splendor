import {MAX_TOKENS_ALLOWED} from "../config.js";

function selectPlayerToken(e) {
    if (!clickedOnButton(e.target)) return;

    const action = getButtonAction(e.target);
    const $tokenContainer = getTokenContainer(e.target);
    const tokensOfTypeAvailable = getTokenAmount($tokenContainer);
    const $amountCounter = getAmountCounter($tokenContainer);
    const amountToDiscard = getAmountToDiscard($amountCounter);

    if (!isValidAction(action, tokensOfTypeAvailable, amountToDiscard)) return;

    if (action === "add") {
        addOneToDiscard($amountCounter);
        increaseTotalDiscardCount();
    } else {
        removeOneToDiscard($amountCounter);
        decreaseTotalDiscardCount();
    }

    setButtonStatuses();
}

function clickedOnButton(target) {
    return target.tagName.toLowerCase() === "button";
}

function getButtonAction(target) {
    return target.dataset.action;
}

function getTokenContainer(target) {
    return target.closest("li");
}

function getTokenAmount(tokenContainer) {
    return parseInt(tokenContainer.dataset.amount);
}

function getAmountCounter($tokenContainer) {
    return $tokenContainer.querySelector(".discard-container .amount");
}

function getAmountToDiscard($amountCounter) {
    return $amountCounter.dataset.amount;
}

function getTotalTokenAmount() {
    return document.querySelector(".player-tokens #current-tokens").dataset.amount;
}

function getTotalAmountDiscarded() {
    return parseInt(document.querySelector(".player-tokens #current-tokens").dataset.amountToDiscard);
}

function isValidAction(action, amountAvailable, amountToDiscard) {
    const totalTokens = getTotalTokenAmount();
    const totalDiscarded = getTotalAmountDiscarded();

    if (action === "add") {
        return amountAvailable - amountToDiscard > 0 && totalTokens - totalDiscarded > MAX_TOKENS_ALLOWED;
    } else {
        return amountToDiscard > 0;
    }
}

function addOneToDiscard($amountCounter) {
    $amountCounter.dataset.amount = parseInt($amountCounter.dataset.amount || 0) + 1;
    $amountCounter.textContent = parseInt($amountCounter.dataset.amount);
}

function increaseTotalDiscardCount() {
    document.querySelector(".player-tokens #current-tokens").dataset.amountToDiscard = getTotalAmountDiscarded() + 1
}

function decreaseTotalDiscardCount() {
    document.querySelector(".player-tokens #current-tokens").dataset.amountToDiscard = getTotalAmountDiscarded() - 1
}

function removeOneToDiscard($amountCounter) {
    $amountCounter.dataset.amount = parseInt($amountCounter.dataset.amount || 0) - 1;
    $amountCounter.textContent = parseInt($amountCounter.dataset.amount);
}

function setButtonStatuses() {
    const totalAmountOfTokens = getTotalTokenAmount();
    const totalAmountDiscarded = getTotalAmountDiscarded();

    for (const $token of document.querySelectorAll(".player-tokens li")) {
        const amountAvailable = parseInt($token.dataset.amount);
        const amountInDiscard = parseInt($token.querySelector(".discard-container .amount").dataset.amount);

        const addButton = $token.querySelector("[data-action='add']");
        const removeButton = $token.querySelector("[data-action='remove']");

        addButton.disabled = amountInDiscard === amountAvailable || totalAmountOfTokens - MAX_TOKENS_ALLOWED === totalAmountDiscarded;
        removeButton.disabled = amountInDiscard === 0;
    }
}

function processDiscardTokens() {

}

export { selectPlayerToken, processDiscardTokens };