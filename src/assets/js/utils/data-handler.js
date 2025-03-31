function binarySearchObjects(list, target, stringAttribute, start = 0, end = list.length - 1) {
    if (start > end) return;

    const mid = Math.floor((start + end) / 2);

    // Copy is needed, E.g: wallet changes would affect the original data
    if (list[mid][stringAttribute] === target) return { ...list[mid] };

    if (list[mid][stringAttribute].localeCompare(target) > 0) {
        return binarySearchObjects(list, target, stringAttribute, start, mid - 1);
    } else {
        return binarySearchObjects(list, target, stringAttribute, mid + 1, end);
    }
}

function copyNode($node) {
    return $node.content.firstElementChild.cloneNode(true);
}

export { copyNode, binarySearchObjects };