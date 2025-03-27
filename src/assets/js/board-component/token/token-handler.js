import {takeThreeGemsRequest, takeTwoGemsRequest} from "./request-handler.js";
import {setActionButtonState} from "../game-status-interface.js";
import {MIN_TOKENS_FOR_PICKING_TWO} from "./config.js";


function canGetToken(tokenType, amount) {

    return (tokenType !== "Gold") && amount >= MIN_TOKENS_FOR_PICKING_TWO;
}
function GiveTokenThatAlreadySelected(tokenType , actionButtonData){
    if (tokenType === actionButtonData.token1) {

        return actionButtonData.token1;
    }
    if (tokenType === actionButtonData.token2) {
       return actionButtonData.token2;
    }
    if (tokenType === actionButtonData.token3) {
        return actionButtonData.token3;
    }
    return null;
}
function checkIfTokenAlreadySelected(tokenType , actionButtonData) {
   return (GiveTokenThatAlreadySelected(tokenType , actionButtonData) !== null)



}
function removeToken(token){
    token = ""
}

function checkIfTokenIsEmpty(token) {
    return (token === undefined || token === "");

}
function selectToken(e) {
    const $selectedToken = e.target.closest("li");
    const tokenType = $selectedToken.dataset.type;
    const $actionButton = document.querySelector(".action-button");
    const $actionButtonData = $actionButton.dataset;

    if (canGetToken(tokenType, $selectedToken.dataset.amount) && checkIfTokenIsEmpty($actionButtonData.token1)) {
        setActionButtonState("Take two", "processTakeTokenClick", {token1: tokenType});

    }else if(checkIfTokenAlreadySelected(tokenType, $actionButtonData)){
        removeToken(GiveTokenThatAlreadySelected(tokenType, $actionButtonData));
    }
        else if (tokenType !== "Gold" && $selectedToken.dataset.amount >=1 && !checkIfTokenAlreadySelected(tokenType, $actionButton)) {

        if(checkIfTokenIsEmpty($actionButtonData.token1)) {
            setActionButtonState("select two more gems", "processTakeTokenClick", {token1: tokenType});

        }else if ($actionButtonData.token2){
            setActionButtonState("select one more gems", "processTakeTokenClick", {token2: tokenType});

        }else if ($actionButtonData.token3){
            setActionButtonState("Take three gems", "processTakeTokenClick", {token3: tokenType});

        }
    }

}

function processTakeTokenClick(e) {
    const $actionButton = document.querySelector(".action-button");
    const actionButtonData = $actionButton.dataset;

    if ($actionButton.textContent !== "Take two") {
        let body = [actionButtonData.token1, actionButtonData.token2 , actionButtonData.token3];
        takeThreeGemsRequest(body)

    } else{
        takeTwoGemsRequest(actionButtonData.token1);

    }


}

function updateTokens(res) {
    const beginIndexAmountText = 1;
    const endIndexAmountText = 3;

    for (const [token, taken] of Object.entries(res["tokens"])) {
     const $token = document.querySelector(`[data-type="${token}"]`);

     $token.dataset.amount = (parseInt($token.dataset.amount) - parseInt(taken));
     const $amountText = $token.querySelector("p");

     $amountText.textContent = `${$token.dataset.amount}${$amountText.textContent.substring(beginIndexAmountText, endIndexAmountText)}`;
    }
}

export {selectToken, processTakeTokenClick, updateTokens};
