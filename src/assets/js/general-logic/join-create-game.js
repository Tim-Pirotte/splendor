import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";

function processResponse(res) {
    saveToStorage("gameId", res["gameId"]);
    saveToStorage("playerToken", res["playerToken"]);
    location.href = "./lobby-page.html";
}

function navigateToMain(e) {
    location.href = "../index.html";
}

function renderPlayerInformation() {
    document.querySelector("#playerName").innerText = loadFromStorage("playerName");
}

export {processResponse, navigateToMain, renderPlayerInformation};
