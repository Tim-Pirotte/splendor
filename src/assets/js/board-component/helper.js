function getActionButton() {
    return document.querySelector(".action-button");
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
    const $tokens = document.querySelectorAll(".board-tokens [data-type]");

    $tokens.forEach($token => {
        tokens[$token.dataset.type] = $token.dataset.amount;
    });

    return tokens;
}

export { getActionButton, mergeObjectsWithSum, getUnclaimedTokens };
