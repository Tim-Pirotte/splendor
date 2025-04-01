function saveToSessionStorage(key, value) {
    if (sessionStorage) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}

function deleteFromSessionStorage(key) {
    if (sessionStorage) {
        sessionStorage.removeItem(key);
    }
}

function loadFromSessionStorage(key) {
    if (sessionStorage) {
        return JSON.parse(localStorage.getItem(key));
    }

    return null;
}

export { saveToSessionStorage, loadFromSessionStorage, deleteFromSessionStorage };
