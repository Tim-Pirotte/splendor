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

function dequeue(pathArray) {
    return pathArray.shift();
}

function removeFromTree(current, pathArray) {
    if (pathArray.length === 1) {
        delete current[pathArray];
        return;
    }

    const currentKey = dequeue(pathArray);
    removeFromTree(current[currentKey], pathArray);
    if (isEmpty(current[currentKey])) delete current[currentKey];
}

function convertTreeToArray(tree, keyNames, result, previousPath) {
    const depth = Object.keys(previousPath).length;

    if (typeof tree !== "object" || depth === keyNames.length) {
        // If 'tree' is an object, the complete tree has a pointer to it.
        // Merging it with 'previousPath' would mutate the original tree structure.
        typeof tree === "object"
            ? result.push({ ...tree, ...previousPath })
            : result.push({ ...previousPath, value: tree });
        return;
    }

    for (const branch of Object.keys(tree)) {
        const treeLevelName = keyNames[depth];
        previousPath[treeLevelName] = branch;
        convertTreeToArray(tree[branch], keyNames, result, { ...previousPath });
    }
}

function unpackMisprintObjects(cardCollection) {
    for (const card of cardCollection) {
        for (const [key, value] of Object.entries(card)) {
            if (typeof value === "object") {
                card["misprintType"] = key;
                Object.assign(card, value);
                delete card[key];
            }
        }
    }
}

export { addToTree, removeFromTree, convertTreeToArray, unpackMisprintObjects };
