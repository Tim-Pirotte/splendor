import { MAX_TOKENS_ALLOWED } from "../config.js";
import * as API from "../../api.js";
import { setDiscardButtonStatuses } from "../renderer/current-player-renderer.js";
import {getActionButton, isCurrentlyPlaying, setActionButtonState} from "../game-status-interface.js";
import {getGameState} from "../../utils/game-object-handler.js";
import {clientMustDiscardToken} from "../state-machine/valid-action-checker.js";

function selectPlayerToken(e) {
    if (!clientMustDiscardToken()) return;

    const $button = e.target.closest("button");

    if (!clickedOnDiscardButton($button)) return;

    const action = getButtonAction($button);
    const $tokenContainer = getTokenContainer($button);
    const $amountCounter = getAmountCounter($tokenContainer);

    if (action === "add") {
        addOneToDiscard($amountCounter);
        increaseTotalDiscardCount();
    } else {
        removeOneToDiscard($amountCounter);
        decreaseTotalDiscardCount();
    }

    setDiscardButtonStatuses();

    if (getTotalTokenAmount() - MAX_TOKENS_ALLOWED === getTotalAmountDiscarded()) {
        setActionButtonState("Discard tokens", "processDiscardTokens", {}, true);
        getActionButton().disabled = false;
    } else {
        setActionButtonState("Choose tokens to discard", "doNothing", {});
        getActionButton().disabled = true;
    }
}

function clickedOnDiscardButton(button) {
    return button.tagName.toLowerCase() === "button" && button.closest("div").classList.contains("discard-container");
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

function getTotalTokenAmount() {
    return document.querySelector(".player-tokens #current-tokens").dataset.amount;
}

function getTotalAmountDiscarded() {
    return parseInt(document.querySelector(".player-tokens #current-tokens").dataset.amountToDiscard);
}

function addOneToDiscard($amountCounter) {
    $amountCounter.dataset.amount = parseInt($amountCounter.dataset.amount || 0) + 1;
    $amountCounter.textContent = parseInt($amountCounter.dataset.amount);
}

function removeOneToDiscard($amountCounter) {
    const amount = parseInt($amountCounter.dataset.amount || 0) - 1;
    $amountCounter.dataset.amount = amount;
    $amountCounter.textContent = amount;
}

function increaseTotalDiscardCount() {
    document.querySelector(".player-tokens #current-tokens").dataset.amountToDiscard = getTotalAmountDiscarded() + 1;
}

function decreaseTotalDiscardCount() {
    document.querySelector(".player-tokens #current-tokens").dataset.amountToDiscard = getTotalAmountDiscarded() - 1;
}

function processDiscardTokens() {
    const tokensToDiscard = getTokensToDiscard();
    const requestBody = {"return": tokensToDiscard};
    API.takeTokens(requestBody);
}

function getTokensToDiscard() {
    const tokens = {};

    for (const $token of document.querySelectorAll(".player-tokens li")) {
        const tokenType = $token.dataset.type;
        const amountToDiscard = parseInt(getAmountCounter($token).dataset.amount);

        if (amountToDiscard !== 0) {
            tokens[tokenType] = amountToDiscard;
        }
    }

    return tokens;
}

export { selectPlayerToken, processDiscardTokens, getTotalTokenAmount, getTotalAmountDiscarded, getTokenAmount };