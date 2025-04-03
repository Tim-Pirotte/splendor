import { saveToStorage } from "../data-connector/local-storage-abstractor.js";

function processCreateAndJoinResponse(res) {
    saveToStorage("gameId", res["gameId"]);
    saveToStorage("playerToken", res["playerToken"]);
    location.href = "./lobby-page.html";
}

export { processCreateAndJoinResponse };

// TODO : remove this form the codebase ! You can place this inside the files of join and create !
