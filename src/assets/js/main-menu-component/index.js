import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";

function init() {
    loadUsername();
    document.querySelector(".form-actions").addEventListener("click", storeUsername)
}

function loadUsername() {
    const $username = document.querySelector("#username");
    const username = loadFromStorage("username");

    if (username) { $username.value = username }
}

function storeUsername(e) {
    e.preventDefault()

    const valueList = ["join-game", "create-game"];
    if (valueList.includes(e.target.value)) {
        console.log("hello world!");
    }
}

init();
