import * as API from "../../api.js";
import { setActionButtonState } from "../game-status-interface.js";
import { MIN_TOKENS_FOR_PICKING_TWO } from "./config.js";
import { MAX_TAKE_TOKENS } from "../config.js";
import {getActionButton} from "../helper.js";

function clickedOnToken(target) {
    return target.tagName.toLowerCase() === "img";
}

function getToken(target) {
    return target.closest("li");
}

function stackExists($actionButton) {
    return $actionButton.dataset.token0;
}

function createStack($actionButton) {
    for (let i = 0; i < MAX_TAKE_TOKENS; i++) {
        $actionButton.dataset[`token${i}`] = "";
    }

    $actionButton.dataset.stackPointer = "0";
}

function tokenInStack($selectedToken, $actionButton, stackPointer) {
    for (let i = 0; i < stackPointer; i++) {
        const token = $actionButton.dataset[`token${i}`];
        if ($selectedToken.dataset.type === token) {
            return true;
        }
    }

    return false;
}

function deselectToken($selectedToken) {
    $selectedToken.classList.remove("selected");
}

function removeTokenFromStack($selectedToken, $actionButton) {
    let shiftStackDown = false;
    for (let i = 0; i < MAX_TAKE_TOKENS; i++) {
        const token = $actionButton.dataset[`token${i}`];

        if (shiftStackDown) {
            $actionButton.dataset[`token${i - 1}`] = token;
        }

        if ($selectedToken.dataset.type === token) {
            shiftStackDown = true;
        }
    }
}

function pushTokenToStack($selectedToken, $actionButton, stackPointer) {
    $actionButton.dataset[`token${stackPointer}`] = $selectedToken.dataset.type;
}

function setActionToTokenAction(stackPointer, $selectedToken) {
    if (stackPointer === 1 && $selectedToken.dataset.amount >= MIN_TOKENS_FOR_PICKING_TWO) {
        setActionButtonState("Take two", "processTakeTwoTokensClick", {});
    } else {
        setActionButtonState("Take up to three", "processTakeTokenClick", {});
    }
}

function highlightToken($selectedToken) {
    $selectedToken.classList.add("selected");
}

function selectToken(e) {
    if (!clickedOnToken(e.target)) return;

    getActionButton().disabled = false;

    const $selectedToken = getToken(e.target);
    if ($selectedToken.dataset.amount < 1) return;

    const $actionButton = getActionButton();
    if (!stackExists($actionButton)) createStack($actionButton);

    let stackPointer = parseInt($actionButton.dataset.stackPointer);

    if (tokenInStack($selectedToken, $actionButton, stackPointer)) {
        deselectToken($selectedToken);
        removeTokenFromStack($selectedToken, $actionButton);
        stackPointer--;
        $actionButton.dataset.stackPointer = stackPointer;

        setActionToTokenAction(stackPointer, $selectedToken);
        return;
    }

    if (stackPointer > MAX_TAKE_TOKENS - 1) return;

    if ($selectedToken.dataset.type === "Gold") return;

    pushTokenToStack($selectedToken, $actionButton, stackPointer);
    stackPointer++;
    $actionButton.dataset.stackPointer = stackPointer;
    highlightToken($selectedToken);

    setActionToTokenAction(stackPointer, $selectedToken);
}

function setTokensTo(stackPointer, $actionButton, amountOfTokens) {
    const requestBody = {take: {}};
    for (let i = 0; i < stackPointer; i++) {
        requestBody.take[$actionButton.dataset[`token${i}`]] = amountOfTokens;
    }

    return requestBody;
}

function updateTokens(res) {
    const beginIndexAmountText = 1;
    const endIndexAmountText = 3;

    for (const [token, taken] of Object.entries(res["tokens"])) {
        const $token = document.querySelector(`.board-tokens [data-type="${token}"]`);
        $token.dataset.amount = parseInt($token.dataset.amount) - parseInt(taken);
        const $amountText = $token.querySelector("p");
        $amountText.textContent = `${$token.dataset.amount}${$amountText.textContent.substring(beginIndexAmountText, endIndexAmountText)}`;
    }
}

function processTakeTokensClick(e) {
    const $actionButton = getActionButton();
    const stackPointer = parseInt($actionButton.dataset.stackPointer);

    const requestBody = setTokensTo(stackPointer, $actionButton, 1);

    API.takeTokens(requestBody).then(res => updateTokens(res));
}

function processTakeTwoTokens(e) {
    const $actionButton = getActionButton();
    const stackPointer = parseInt($actionButton.dataset.stackPointer);

    const requestBody = setTokensTo(stackPointer, $actionButton, 2);

    API.takeTokens(requestBody).then(res => updateTokens(res));
}

function processSkipTurn() {
    API.takeTokens({take: {Ruby: 0}}).then(res => updateTokens(res));
}

export { selectToken, processTakeTokensClick, updateTokens, processTakeTwoTokens, processSkipTurn };
