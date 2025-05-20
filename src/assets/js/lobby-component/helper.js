function getContainerToRenderPlayer($joinedPlayerContainers) {
    for (const $container of $joinedPlayerContainers) {
        if (!$container.childNodes.length) return $container;
    }
}

function getContainerAnimationForLeaving($container) {
    //https://www.geeksforgeeks.org/how-to-get-current-value-of-a-css-property-in-javascript/
    const currentContainerTransform = window.getComputedStyle($container).transform;

    return [
        { transform: `${currentContainerTransform} scale(1)` },
        { transform: `${currentContainerTransform} scale(0)` },
    ];
}

export { getContainerToRenderPlayer, getContainerAnimationForLeaving };