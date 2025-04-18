function updateTree(current, pathArray, depth, value) {
    const keyToInsert = pathArray[pathArray.length - depth];

    if (!(keyToInsert in current)) current[keyToInsert] = {};

    if (depth === 1) {
        current[keyToInsert] = value;
    } else {
        updateTree(current[keyToInsert], pathArray, depth - 1, value);
    }
}

function convertTreeToArray(tree, keyNames, result, previousPath, maxDepth) {
    if (typeof tree !== "object" || maxDepth === 1) {
        result.push(Object.assign(tree, previousPath));
        return;
    }

    for (const branch of Object.keys(tree)) {
        // .shift() dequeues the first element in the array
        previousPath[keyNames.shift()] = branch;
        convertTreeToArray(tree[branch], keyNames, result, previousPath, maxDepth - 1);
    }
}

export { updateTree, convertTreeToArray };
