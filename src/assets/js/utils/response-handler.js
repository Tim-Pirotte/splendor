import { saveToStorage } from "../data-connector/local-storage-abstractor.js";

function processJoinAndCreateResponse(res) {
    saveToStorage("gameId", res["gameId"]);
    saveToStorage("playerToken", res["playerToken"]);
    location.href = "./lobby-page.html";
}

export { processJoinAndCreateResponse };
