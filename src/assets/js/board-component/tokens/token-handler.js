import { MAX_TAKE_TOKENS, MIN_TOKENS_FOR_PICKING_TWO } from "../config.js";
import * as API from "../../api.js";
import { deselectAll, getActionButton, setActionButtonState } from "../game-status-interface.js";
import { validTokenTake } from "../state-machine/valid-action-checker.js";
import { getCurrentAction, reflowCSS } from "../helper.js";

function clickedOnToken(target) {
    return target.tagName.toLowerCase() === "li";
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
    $selectedToken.querySelector("span").textContent = "";
    $selectedToken.querySelector("p").classList.remove("pulsing-text");
}

function unHighlightBoardTokens() {
    document.querySelectorAll(".board-tokens > li").forEach($token => deselectToken($token));
}

function removeTokenFromStack($selectedToken, $actionButton) {
    let shiftStackDown = false;

    for (let i = 0; i < MAX_TAKE_TOKENS + 1; i++) {
        const token = $actionButton.dataset[`token${i}`];

        if (shiftStackDown) {
            $actionButton.dataset[`token${i - 1}`] = token || "";
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
    let firstTokenInStack = null;

    if ("token0" in getActionButton().dataset) {
        firstTokenInStack = getActionButton().dataset.token0;
    }

    if (firstTokenInStack !== "") {
        tokenAmount = document.querySelector(`.board-tokens [data-type="${firstTokenInStack}"]`).dataset.amount;
    }

    if(stackPointer === 0) {
        setActionButtonState("skip turn", "skipTurn", {});
        return;
    }

    if (stackPointer === 1 && tokenAmount >= MIN_TOKENS_FOR_PICKING_TWO) {
        setActionButtonState("Take two", "processTakeTwoTokensClick", {}, false);
        highlightTokens(getActionButton(), "2");
    } else {
        setActionButtonState("Take up to three", "processTakeTokenClick", {}, false);
        highlightTokens(getActionButton(), "1");
    }
}

function highlightTokens($actionButton, amountToTake) {
    for (let i = 0; i < parseInt($actionButton.dataset.stackPointer); i++) {
        const tokenType = $actionButton.dataset[`token${i}`];
        const $boardToken = document.querySelector(`.board-tokens [data-type=${tokenType}]`);

        $boardToken.querySelector("span").textContent = `- ${amountToTake}`;

        const $boardTokenText = $boardToken.querySelector("p");
        // Remove them first to sync animations between elements
        $boardTokenText.classList.remove("pulsing-text");
        reflowCSS($boardTokenText);
        $boardTokenText.classList.add("pulsing-text");
    }
}

function removeTokenFromList($selectedToken, $actionButton, stackPointer) {
    deselectToken($selectedToken);
    removeTokenFromStack($selectedToken, $actionButton);
    stackPointer--;
    $actionButton.dataset.stackPointer = stackPointer;

    return stackPointer;
}

function addTokenToList($selectedToken, $actionButton, stackPointer) {
    pushTokenToStack($selectedToken, $actionButton, stackPointer);
    stackPointer++;
    $actionButton.dataset.stackPointer = stackPointer;
    return stackPointer;
}

function selectToken(e) {
    if (!validTokenTake() || !clickedOnToken(e.target)) return;
    if (!["processTakeTokenClick", "processTakeTwoTokensClick"].includes(getCurrentAction())) deselectAll();

    getActionButton().disabled = false;

    const $selectedToken = e.target;

    if ($selectedToken.dataset.amount < 1) return;

    const $actionButton = getActionButton();

    if (!stackExists($actionButton)) createStack($actionButton);

    let stackPointer = parseInt($actionButton.dataset.stackPointer);

    if (tokenInStack($selectedToken, $actionButton, stackPointer)) {
        stackPointer = removeTokenFromList($selectedToken, $actionButton, stackPointer);
        setActionToTokenAction(stackPointer);

        if(stackPointer === undefined){
            setActionButtonState("skip turn", "skipTurn", {}, false);
        }

        return;
    }

    if (stackPointer > MAX_TAKE_TOKENS - 1) return;

    if ($selectedToken.dataset.type === "Gold") return;

    stackPointer = addTokenToList($selectedToken, $actionButton, stackPointer);
    setActionToTokenAction(stackPointer);
}

function setTokensTo(stackPointer, $actionButton, amountOfTokens) {
    const requestBody = { take: {} };

    for (let i = 0; i < stackPointer; i++) {
        requestBody.take[$actionButton.dataset[`token${i}`]] = amountOfTokens;
    }

    return requestBody;
}

function processTakeTokensClick() {
    const $actionButton = getActionButton();
    const stackPointer = parseInt($actionButton.dataset.stackPointer);

    const requestBody = setTokensTo(stackPointer, $actionButton, 1);

    playShakeAnimation(requestBody["take"]);

    API.takeTokens(requestBody);
}

function processTakeTwoTokens() {
    const $actionButton = getActionButton();
    const stackPointer = parseInt($actionButton.dataset.stackPointer);

    const requestBody = setTokensTo(stackPointer, $actionButton, 2);

    playShakeAnimation(requestBody["take"]);

    API.takeTokens(requestBody);
}

function playShakeAnimation(tokens, factor = 1) {
    const shakeAnimationDuration = 400;

    toggleTokenShake(true, true);
    setTimeout(toggleTokenShake, shakeAnimationDuration);

    function toggleTokenShake(start = false, updateTokenText = false) {
        for (const token of Object.keys(tokens)) {
            const $tokenText = document.querySelector(`.player-tokens [data-type="${token}"] .amount`);

            if (updateTokenText) $tokenText.textContent = parseInt($tokenText.textContent) + tokens[token] * factor;

            $tokenText.classList.toggle("shake", start);
        }
    }
}

export { selectToken, processTakeTokensClick, processTakeTwoTokens, unHighlightBoardTokens, playShakeAnimation };
