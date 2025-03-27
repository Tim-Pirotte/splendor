import {saveToStorage} from "../data-connector/local-storage-abstractor.js";

function processResponse(res) {
    saveToStorage("gameId", res["gameId"]);
    saveToStorage("playerToken", res["playerToken"]);
    location.href = "./lobby-page.html";
}

export {processResponse};
