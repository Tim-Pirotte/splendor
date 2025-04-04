import * as API from "../api.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";

function locateToMainMenu() {
    location.href = `./../index.html`;
}

function joinGameById(gameId) {
    API.joinGame(gameId)
       .then(response => {
           saveToStorage("gameId", response["gameId"]);
           saveToStorage("playerToken", response["playerToken"]);
           location.href = "./lobby-page.html";
       });
}

export { locateToMainMenu, joinGameById };
