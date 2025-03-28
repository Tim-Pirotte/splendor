import { takeGemsRequest } from "./request-handler.js";
import { setActionButtonState } from "../game-status-interface.js";
import { MIN_TOKENS_FOR_PICKING_TWO } from "./config.js";

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

function removeToken(token , actionButtonData) {
    const token1 = 1;
    const token2 = 2;
    const token3 = 3;

    if (token === token1){
        actionButtonData.token1 = "";
    }
    if (token === token2){
        actionButtonData.token2 = "";
    }
    if (token === token3){
        actionButtonData.token3 = "";
    }
}

function checkIfTokenIsEmpty(token) {
    return (token === undefined || token === "");
}
function selectToken(e) {
    if (e.target.tagName.toLowerCase() === "img") {
        const $selectedToken = e.target.closest("li");
        const tokenType = $selectedToken.dataset.type;
        const $actionButton = document.querySelector(".action-button");
        const $actionButtonData = $actionButton.dataset;

        if (canGetToken(tokenType, $selectedToken.dataset.amount, $actionButtonData)) {
            setActionButtonState("Take two", "processTakeTokenClick", {token1: tokenType});
        }

        if (checkIfTokenAlreadySelected(tokenType, $actionButtonData)) {
            removeToken(giveTokenThatAlreadySelected(tokenType, $actionButtonData), $actionButtonData);
        }

        if (tokenType !== "Gold" && $selectedToken.dataset.amount >= 1 && !checkIfTokenAlreadySelected(tokenType, $actionButton)) {
            storeTokenInDOM($actionButtonData , tokenType);
        }
    }
}

function storeTokenInDOM($actionButtonData , tokenType) {
    if (checkIfTokenIsEmpty($actionButtonData.token1)) {
        setActionButtonState("select two more gems", "processTakeTokenClick", {token1: tokenType});
    }

    if (checkIfTokenIsEmpty($actionButtonData.token2)) {
        setActionButtonState("select one more gems", "processTakeTokenClick", {token2: tokenType});
    }

    if (checkIfTokenIsEmpty($actionButtonData.token3)) {
        setActionButtonState("Take three gems", "processTakeTokenClick", {token3: tokenType});
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

function updateTokens(res) {
    const beginIndexAmountText = 1;
    const endIndexAmountText = 3;

    for (const [token, taken] of Object.entries(res["tokens"])) {
     const $token = document.querySelector(`[data-type="${token}"]`);
     $token.dataset.amount = (parseInt($token.dataset.amount) - parseInt(taken)).toString();
     const $amountText = $token.querySelector("p");

     $amountText.textContent = `${$token.dataset.amount}${$amountText.textContent.substring(beginIndexAmountText, endIndexAmountText)}`;
    }
}

export { selectToken, processTakeTokenClick, updateTokens };
