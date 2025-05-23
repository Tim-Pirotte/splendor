function getContainerAnimationForLeaving($container) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
    const currentContainerTransform = window.getComputedStyle($container).transform;

    return [
        { transform: `${currentContainerTransform} scale(1)` },
        { transform: `${currentContainerTransform} scale(0)` },
    ];
}

function isAddBotButton($player) {
    return $player.classList.contains("add-bot");
}

function hasSomethingRenderedInside($player) {
    return $player.childElementCount > 0;
}

function getSharingLink() {
    const splittedLink = window.location.href.split("/");
    splittedLink[splittedLink.length - 1] = "join-game.html";

    const link = splittedLink.join("/");
    console.log(link)
}

export { getContainerAnimationForLeaving, isAddBotButton, hasSomethingRenderedInside, getSharingLink };