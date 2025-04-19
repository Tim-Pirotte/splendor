function addToTree(current, pathArray, depth, value) {
    const keyToInsert = pathArray[pathArray.length - depth];

    if (!(keyToInsert in current)) current[keyToInsert] = {};

    if (depth === 1) {
        // Prevents overwriting existing values
        if (isEmpty(current[keyToInsert])) {
            current[keyToInsert] = value;
            return true;
        } else {
            return false;
        }
    } else {
        return addToTree(current[keyToInsert], pathArray, depth - 1, value);
    }
}

function isEmpty(object) {
    return Object.keys(object).length === 0;
}

function removeFromTree(current, pathArray) {
    if (pathArray.length === 1) {
        delete current[pathArray];
        return;
    }

    // This dequeues the first element
    const currentKey = pathArray.shift();
    removeFromTree(current[currentKey], pathArray);
}

function convertTreeToArray(tree, keyNames, result, previousPath, maxDepth) {
    if (typeof tree !== "object" || maxDepth === 1) {
        result.push(Object.assign(tree, previousPath));
        return;
    }

    for (const branch of Object.keys(tree)) {
        previousPath[keyNames[keyNames.length - maxDepth + 1]] = branch;
        convertTreeToArray(tree[branch], keyNames, result, previousPath, maxDepth - 1);
    }
}

export { addToTree, convertTreeToArray };
