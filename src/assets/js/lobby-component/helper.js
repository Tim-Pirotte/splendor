import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";

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

/* https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams
*  https://developer.mozilla.org/en-US/docs/Web/API/URL */
function getLinkWithGameIdParam(page) {
    const splittedLink = window.location.href.split("/");
    splittedLink[splittedLink.length - 1] = `${page}.html`;

    const link = new URL(splittedLink.join("/"))
    link.searchParams.set("gameId", loadFromStorage("gameId"))

    return link.toString();
}

export { getContainerAnimationForLeaving, isAddBotButton, hasSomethingRenderedInside, getLinkWithGameIdParam };