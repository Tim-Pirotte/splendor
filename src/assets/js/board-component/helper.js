function setActionButton(message, tokenType, action) {
    const $actionButton = document.querySelector(".action-button");
    $actionButton.textContent = message;
    $actionButton.dataset.type = tokenType;
    $actionButton.dataset.action = action;
}


function mergeObjectsWithSum(obj1, obj2) {
    for (const tokenType in obj2) {
        if (obj1.hasOwnProperty(tokenType)) {
            obj1[tokenType] = parseInt(obj1[tokenType]) + parseInt(obj2[tokenType]);
        } else {
            obj1[tokenType] = parseInt(obj2[tokenType]);
        }
    }
    return obj1;
}

function getUnclaimedTokens() {
    const tokens = {};
    const $tokenContainers = document.querySelectorAll(".board-tokens li[data-type]");
    $tokenContainers.forEach($tokenContainer => {
        tokens[$tokenContainer.dataset.type] = $tokenContainer.querySelector(".amount").innerText.split("/")[0];
    });

    return tokens;
}

export {setActionButton, mergeObjectsWithSum, getUnclaimedTokens};
