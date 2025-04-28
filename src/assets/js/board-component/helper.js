import {getActionButton} from "./game-status-interface.js";

function sumObjectValues(obj1, obj2) {
    for (const tokenType in obj2) {
        if (tokenType in obj1) {
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

function reflowCSS($node) {
    // NOSONAR_BEGIN
    $node.offsetHeight;
    // NOSONAR_END
}

function getCurrentAction() {
    return getActionButton().dataset.functionToRun;
}
export { sumObjectValues, getUnclaimedTokens, reflowCSS, getCurrentAction };
