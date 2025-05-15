function getContainerToRenderPlayer($joinedPlayerContainers) {
    for (const $container of $joinedPlayerContainers) {
        if (!$container.childNodes.length) return $container;
    }
}

export { getContainerToRenderPlayer }