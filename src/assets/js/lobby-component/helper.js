function getContainerAnimationForLeaving($container) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
    const currentContainerTransform = window.getComputedStyle($container).transform;

    return [
        { transform: `${currentContainerTransform} scale(1)` },
        { transform: `${currentContainerTransform} scale(0)` },
    ];
}

export { getContainerAnimationForLeaving };