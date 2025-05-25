function saveToStorage(key, value) {
    if (localStorage) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

function deleteFromStorage(key) {
    if (localStorage) {
        localStorage.removeItem(key);
    }
}

function loadFromStorage(key) {
    if (localStorage) {
        return JSON.parse(localStorage.getItem(key));
    }

    return null;
}

function loadFromStorageWithDefault(key, defaultValue){
    const value = loadFromStorage(key);
    return value === null ? defaultValue : value;
}

export { saveToStorage, loadFromStorage, loadFromStorageWithDefault, deleteFromStorage };
