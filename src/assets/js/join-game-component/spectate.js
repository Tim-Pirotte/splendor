import { checkCompatibility } from "../server-version-component/server-version.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";


function spectateGame(gameId) {
    checkCompatibility(2)
        .then(isCompatible => {
            if (!isCompatible) {
                spectateNotAvailable();
            } else {
                saveToStorage("gameId", gameId);
                location.href = "./board.html";
            };
        });
}

function spectateNotAvailable() {
    document.querySelector(".error-messages").innerHTML = "<p>Spectating is not supported on this server. Sorry for the Inconvenience.</p>";
}

function stopSpectating() {
    location.href = "./join-game.html";
}

export { spectateGame, stopSpectating };