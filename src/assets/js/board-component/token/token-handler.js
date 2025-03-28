import { takeGemsRequest } from "./request-handler.js";
import { setActionButtonState } from "../game-status-interface.js";
import { MIN_TOKENS_FOR_PICKING_TWO } from "./config.js";
import {MAX_TAKE_TOKENS} from "../config.js";

function canGetToken(tokenType, amount , $actionButtonData) {
    if(checkIfTokenIsEmpty($actionButtonData.token1)){
        return (tokenType !== "Gold") && amount >= MIN_TOKENS_FOR_PICKING_TWO;
    }
   return false;
}

function giveTokenThatAlreadySelected(tokenType , actionButtonData){
    const token1 = 1;
    const token2 = 2;
    const token3 = 3;

    if (tokenType === actionButtonData.token1) {
        return token1;
    }
    if (tokenType === actionButtonData.token2) {
       return token2;
    }
    if (tokenType === actionButtonData.token3) {
        return token3;
    }
    return null;
}

function checkIfTokenAlreadySelected(tokenType , actionButtonData) {
   return (giveTokenThatAlreadySelected(tokenType , actionButtonData) !== null);
}

function removeToken(token , $actionButtonData , tokenType) {
    const token1 = 1;
    const token2 = 2;
    const token3 = 3;

    if (token === token1){
        $actionButtonData.token1 = $actionButtonData.token2;
        $actionButtonData.token2 = $actionButtonData.token3;
        $actionButtonData.token3 = "";

    }
    if (token === token2){
        $actionButtonData.token2 = $actionButtonData.token3;
        $actionButtonData.token3 = "";

    }
    if (token === token3){
        $actionButtonData.token3 = "";

    }


}

function checkIfTokenIsEmpty(token) {
    return (token === undefined || token === "");
}

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

function removeTokenFromStack($selectedToken, $actionButton, stackPointer) {
    let shiftStackDown = false;
    for (let i = 0; i < stackPointer; i++) {
        const token = $actionButton.dataset[`token${i}`];

        if ($selectedToken.dataset.type === token) {
            shiftStackDown = true;
        }

        if (shiftStackDown) {
            $actionButton.dataset[`token${i - 1}`] = token;
        }
    }
}

function pushTokenToStack($selectedToken, $actionButton, stackPointer) {
    console.log(stackPointer)
    $actionButton.dataset[`token${stackPointer}`] = $selectedToken.dataset.type;
}

function setActionToTokenAction(stackPointer, $selectedToken) {
    if (stackPointer === 1 && $selectedToken.dataset.amount >= MIN_TOKENS_FOR_PICKING_TWO) {
        setActionButtonState("Take two", "processTakeTwoTokensClick", {});
    } else {
        setActionButtonState("Take up to three", "processTakeTwoTokensClick", {});
    }
}

function selectToken(e) {
    if (!clickedOnToken(e.target)) return;

    const $selectedToken = getToken(e.target);
    if ($selectedToken.dataset.amount < 1) return;

    const $actionButton = document.querySelector(".action-button");
    if (!stackExists($actionButton)) createStack($actionButton);

    let stackPointer = parseInt($actionButton.dataset.stackPointer);
    if (stackPointer > MAX_TAKE_TOKENS - 1) return;

    if (tokenInStack($selectedToken, $actionButton, stackPointer)) {
        deselectToken($selectedToken);
        removeTokenFromStack($selectedToken, $actionButton, stackPointer);
        $actionButton.dataset.stackPointer = stackPointer - 1;

        setActionToTokenAction(stackPointer, $selectedToken);
        return;
    }

    if ($selectedToken.dataset.type === "Gold") return;

    pushTokenToStack($selectedToken, $actionButton, stackPointer);
    stackPointer++;
    $actionButton.dataset.stackPointer = stackPointer;

    setActionToTokenAction(stackPointer, $selectedToken);
}

function selectTokenPrevious(e) {
    if (e.target.tagName.toLowerCase() === "img") {
        const $selectedToken = e.target.closest("li");
        const tokenType = $selectedToken.dataset.type;
        const $actionButton = document.querySelector(".action-button");
        const $actionButtonData = $actionButton.dataset;

        if (canGetToken(tokenType, $selectedToken.dataset.amount, $actionButtonData)) {
            setActionButtonState("Take two", "processTakeTokenClick", {token1: tokenType});
        }  else if (checkIfTokenAlreadySelected(tokenType, $actionButtonData)) {
            removeToken(giveTokenThatAlreadySelected(tokenType, $actionButtonData), $actionButtonData , tokenType);
        }  else if (tokenType !== "Gold" && $selectedToken.dataset.amount >= 1 && !checkIfTokenAlreadySelected(tokenType, $actionButton)) {
            storeTokenInDOM($actionButtonData , tokenType);
        }
    }
}

function storeTokenInDOM($actionButtonData , tokenType) {
    if (checkIfTokenIsEmpty($actionButtonData.token1)) {
        setActionButtonState("Selected 1 gem", "processTakeTokenClick", {token1: tokenType});
    } else if (checkIfTokenIsEmpty($actionButtonData.token2)) {
        setActionButtonState("Selected 2 gems", "processTakeTokenClick", {token2: tokenType});
    } else if (checkIfTokenIsEmpty($actionButtonData.token3)) {
        setActionButtonState("Selected three gems", "processTakeTokenClick", {token3: tokenType});
    }
}

function processTakeTokenClick(e) {
    const $actionButton = document.querySelector(".action-button");
    const actionButtonData = $actionButton.dataset;

    if ($actionButton.textContent !== "Take two") {
        const body = [actionButtonData.token1, actionButtonData.token2 , actionButtonData.token3];
        takeGemsRequest(body , "");
    } else{
        takeGemsRequest(actionButtonData.token1 , "takeTwo");
    }
}

function processTakeTwoTokens(e) {

}

function updateTokens(res) {
    const beginIndexAmountText = 1;
    const endIndexAmountText = 3;

    for (const [token, taken] of Object.entries(res["tokens"])) {
     const $token = document.querySelector(`[data-type="${token}"]`);
     $token.dataset.amount = (parseInt($token.dataset.amount) - parseInt(taken)).toString() || "0";
     const $amountText = $token.querySelector("p");
     $amountText.textContent = `${$token.dataset.amount}${$amountText.textContent.substring(beginIndexAmountText, endIndexAmountText)}`;
    }
}

export { selectToken, processTakeTokenClick, updateTokens, processTakeTwoTokens };
