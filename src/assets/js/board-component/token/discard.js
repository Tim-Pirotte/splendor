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
    } else {
        removeOneToDiscard($amountCounter);
    }
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
    return tokenContainer.dataset.amount;
}

function getAmountCounter($tokenContainer) {
    return $tokenContainer.querySelector(".discard-container .amount");
}

function getAmountToDiscard($amountCounter) {
    return $amountCounter.dataset.amount;
}

function isValidAction(action, amountAvailable, amountToDiscard) {
    if (action === "add") {
        return amountAvailable - amountToDiscard > 0;
    } else {
        return amountToDiscard > 0;
    }
}

function addOneToDiscard($amountCounter) {
    $amountCounter.dataset.amount = parseInt($amountCounter.dataset.amount || 0) + 1;
    $amountCounter.textContent = parseInt($amountCounter.dataset.amount);
}

function removeOneToDiscard($amountCounter) {
    $amountCounter.dataset.amount = parseInt($amountCounter.dataset.amount || 0) - 1;
    $amountCounter.textContent = parseInt($amountCounter.dataset.amount);
}

function processDiscardTokens() {

}

export { selectPlayerToken, processDiscardTokens };