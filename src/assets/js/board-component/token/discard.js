function selectPlayerToken(e) {
    if (!clickedOnButton(e.target)) return;
    console.log("yes")
}

function clickedOnButton(target) {
    return target.tagName.toLowerCase() === "button";
}

function processDiscardTokens() {

}

export { selectPlayerToken, processDiscardTokens };