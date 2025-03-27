import {takeTwoGemsRequest} from "./request-handler.js";
import {setActionButtonState} from "../game-status-interface.js";
import {MIN_TOKENS_FOR_PICKING_TWO, MIN_TOKENS_FOR_PICKING_ONE} from "./config.js";


function canGetToken(tokenType, amount) {
    return !(tokenType === "Gold") && amount >= MIN_TOKENS_FOR_PICKING_TWO;
}

function checkIfTokenAlreadySelectedAndRemoveIfSo(tokenType , actionButton) {
    if (tokenType === actionButton.dataset.token1) {
        actionButton.dataset.token1 = "leeg";
        return true
    }
    if (tokenType === actionButton.dataset.token2) {
        actionButton.dataset.token2 = "leeg"
        return true
    }
    if (tokenType === actionButton.dataset.token3) {
        actionButton.dataset.token3="leeg";
        return true
    }
    return false;
}
function removeTokenFromDataset(dataset){

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

        if($actionButton.dataset.token1 === undefined || $actionButton.dataset.token1 === "leeg" ) {
            setActionButtonState("Take three", "processTakeTokenClick", {token1: tokenType});

        }else if ($actionButton.dataset.token2 === undefined || $actionButton.dataset.token2 === "leeg"){
            setActionButtonState("Take three", "processTakeTokenClick", {token2: tokenType});

        }else if ($actionButton.dataset.token3 === undefined || $actionButton.dataset.token3 === "leeg"){
            setActionButtonState("Take three", "processTakeTokenClick", {token3: tokenType});

        }

        console.log("Ik ga er drie pakke")
        console.log($actionButton.dataset.token1+ ""+ $actionButton.dataset.token2 + ""+ $actionButton.dataset.token3 );
    }

}

function processTakeTokenClick(e) {
    const $actionButton = document.querySelector(".action-button");
    takeTwoGemsRequest($actionButton.dataset.token1);
}

function updateTokens(res) {
    const beginIndexAmountText = 1;
    const endIndexAmountText = 3;

    for (const [token, taken] of Object.entries(res["tokens"])) {
     const $token = document.querySelector(`[data-type="${token}"]`);
     $token.dataset.amount = parseInt($token.dataset.amount) - parseInt(taken);
     const $amountText = $token.querySelector("p");
     $amountText.textContent = `${$token.dataset.amount}${$amountText.textContent.substring(beginIndexAmountText, endIndexAmountText)}`;
    }
}

export {selectToken, processTakeTokenClick, updateTokens};
