import * as API from "../../api.js";
import {clearDatasetAttributes, getActionButton, setActionButtonState} from "../game-status-interface.js";
import { MIN_TOKENS_FOR_PICKING_TWO } from "./config.js";
import { MAX_TAKE_TOKENS } from "../config.js";
import { deselectCard } from "../buy/buy-handler.js";
import {validTokenTake} from "../state-machine/valid-action-checker.js";

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
    $selectedToken.classList.remove("selected-token");
}

function removeTokenFromStack($selectedToken, $actionButton) {
    let shiftStackDown = false;

    for (let i = 0; i < MAX_TAKE_TOKENS + 1; i++) {
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

function setActionToTokenAction(stackPointer) {
    let tokenAmount = -1;
    const firstTokenInStack = getActionButton().dataset.token0;
    if (firstTokenInStack) {
        tokenAmount = document.querySelector(`.board-tokens [data-type="${firstTokenInStack}"]`).dataset.amount;
    }

    if (stackPointer === 1 && tokenAmount >= MIN_TOKENS_FOR_PICKING_TWO) {
        setActionButtonState("Take two", "processTakeTwoTokensClick", {}, false);
    } else {
        setActionButtonState("Take up to three", "processTakeTokenClick", {}, false);
    }
}

function highlightToken($selectedToken) {
    $selectedToken.classList.add("selected-token");
}

function selectToken(e) {
    if (!validTokenTake()) return;

    deselectCard();

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

        setActionToTokenAction(stackPointer);

        return;
    }

    if (stackPointer > MAX_TAKE_TOKENS - 1) return;

    if ($selectedToken.dataset.type === "Gold") return;

    pushTokenToStack($selectedToken, $actionButton, stackPointer);
    stackPointer++;
    $actionButton.dataset.stackPointer = stackPointer;
    highlightToken($selectedToken);

    setActionToTokenAction(stackPointer);
}

function setTokensTo(stackPointer, $actionButton, amountOfTokens) {
    const requestBody = { take: {} };

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

function processTakeTokensClick() {
    const $actionButton = getActionButton();
    const stackPointer = parseInt($actionButton.dataset.stackPointer);

    const requestBody = setTokensTo(stackPointer, $actionButton, 1);

    API.takeTokens(requestBody).then(res => updateTokens(res));
}

function processTakeTwoTokens() {
    const $actionButton = getActionButton();
    const stackPointer = parseInt($actionButton.dataset.stackPointer);

    const requestBody = setTokensTo(stackPointer, $actionButton, 2);

    API.takeTokens(requestBody).then(res => updateTokens(res));
}

function processSkipTurn() {
    API.takeTokens({ take: { Ruby: 0 } }).then(res => updateTokens(res));
}

export { selectToken, processTakeTokensClick, updateTokens, processTakeTwoTokens, processSkipTurn };
