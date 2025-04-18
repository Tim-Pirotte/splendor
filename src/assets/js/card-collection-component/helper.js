function updateTree(current, pathArray, depth, value) {
    const keyToInsert = pathArray[pathArray.length - depth];

    if (!(keyToInsert in current)) current[keyToInsert] = {};

    if (depth === 1) {
        current[keyToInsert] = value;
    } else {
        updateTree(current[keyToInsert], pathArray, depth - 1, value);
    }
}

function convertTreeToArray() {

}