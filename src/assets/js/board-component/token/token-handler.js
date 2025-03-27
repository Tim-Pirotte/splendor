import {takeThreeGemsRequest, takeTwoGemsRequest} from "./request-handler.js";
import {setActionButtonState} from "../game-status-interface.js";
import {MIN_TOKENS_FOR_PICKING_TWO, MIN_TOKENS_FOR_PICKING_ONE} from "./config.js";


function canGetToken(tokenType, amount) {
    return !(tokenType === "Gold") && amount >= MIN_TOKENS_FOR_PICKING_TWO;
}

function checkIfTokenAlreadySelectedAndRemoveIfSo(tokenType , actionButton) {
    if (tokenType === actionButton.dataset.token1) {
        actionButton.dataset.token1 = "";
        return true
    }
    if (tokenType === actionButton.dataset.token2) {
        actionButton.dataset.token2 = ""
        return true
    }
    if (tokenType === actionButton.dataset.token3) {
        actionButton.dataset.token3="";
        return true
    }
    return false;
}
function checkIfToken1ToToken3IsNotEmpty(actionButton) {
    if (actionButton.token1 === undefined || actionButton.token1 === "") {
        return false;
    }else if(actionButton.token2 === undefined || actionButton.token2 === ""){
        return false;
    }else return !(actionButton.token3 === undefined || actionButton.token3 === "");
}
function selectToken(e) {
    const $selectedToken = e.target.closest("li");
    const tokenType = $selectedToken.dataset.type;
    const $actionButton = document.querySelector(".action-button");

    if (canGetToken(tokenType, $selectedToken.dataset.amount)) {
        setActionButtonState("Take two", "processTakeTokenClick", {token1: tokenType});

    }else if(checkIfTokenAlreadySelectedAndRemoveIfSo(tokenType, $actionButton)){
        console.log("yeet");
        console.log($actionButton.dataset.token1+ ""+ $actionButton.dataset.token2 + ""+ $actionButton.dataset.token3 );
    } else if (tokenType !== "Gold" && $selectedToken.dataset.amount >=1 && !checkIfTokenAlreadySelectedAndRemoveIfSo(tokenType, $actionButton)) {

        if($actionButton.dataset.token1 === undefined || $actionButton.dataset.token1 === "" ) {
            setActionButtonState("select two more gems", "processTakeTokenClick", {token1: tokenType});

        }else if ($actionButton.dataset.token2 === undefined || $actionButton.dataset.token2 === ""){
            setActionButtonState("select one more gems", "processTakeTokenClick", {token2: tokenType});

        }else if ($actionButton.dataset.token3 === undefined || $actionButton.dataset.token3 === ""){
            setActionButtonState("Take three gems", "processTakeTokenClick", {token3: tokenType});

        }

        console.log("Ik ga er drie pakke")
        console.log($actionButton.dataset.token1+ ""+ $actionButton.dataset.token2 + ""+ $actionButton.dataset.token3 );
    }

}

function processTakeTokenClick(e) {
    const $actionButton = document.querySelector(".action-button");
    const actionButtonData = $actionButton.dataset;
    if (checkIfToken1ToToken3IsNotEmpty(actionButtonData)) {
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
     $token.dataset.amount = (parseInt($token.dataset.amount) - parseInt(taken)).toString();
     const $amountText = $token.querySelector("p");
     $amountText.textContent = `${$token.dataset.amount}${$amountText.textContent.substring(beginIndexAmountText, endIndexAmountText)}`;
    }
}

export {selectToken, processTakeTokenClick, updateTokens};
