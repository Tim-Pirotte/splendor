
function mergeObjectsWithSum(obj1, obj2) {
    for (const tokenType in obj2) {
        if (obj1.hasOwnProperty(tokenType)) {
            obj1[tokenType] += ob2[tokenType];
        } else {
            obj1[tokenType] = obj2[tokenType];
        }
    }
}

export {mergeObjectsWithSum}