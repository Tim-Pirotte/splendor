import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";

function init() {
    loadUsername();
    document.querySelector(".form-actions").addEventListener("click", storeUsername);
}

function loadUsername() {
    const $username = document.querySelector("#username");
    const username = loadFromStorage("username");

    if (username) {
        $username.value = username
    }
}

function storeUsername(e) {
    e.preventDefault();

    const valid = document.querySelector("form").reportValidity();
    const username = document.querySelector("#username").value;

    if (valid && (username.trim() !== "")) {
        saveToStorage("username", username);
        window.location.href = `../../../pages/${e.target.value}.html`;
    }
}

init();
