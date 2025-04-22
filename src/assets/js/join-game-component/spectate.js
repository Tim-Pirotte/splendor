import { checkCompatibility } from "../server-version-component/server-version.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderUnsupportedError } from "../utils/renderer.js";

function spectateGame(gameId) {
    checkCompatibility(2)
        .then(isCompatible => {
            if (!isCompatible) {
                renderUnsupportedError(document.querySelector(".error-messages"), "Spectating");
            } else {
                saveToStorage("gameId", gameId);
                location.href = "./board.html";
            }
        });
}

function stopSpectating() {
    location.href = "./join-game.html";
}

export { spectateGame, stopSpectating };