import {loadFromStorage} from "../data-connector/local-storage-abstractor";

function init() {
    loadUsername();
}

function loadUsername() {
    const $username = document.querySelector("#username");
    const username = loadFromStorage("username");

    if (username) { $username.value = username }
}

init();
