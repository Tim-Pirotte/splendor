import { checkCompatibility } from "../server-version-component/server-version.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderUnsupportedError } from "../utils/renderer.js";
import * as API from "../api.js";
import {renderErrorMessage} from "./renderer.js";

function spectateGame(gameId) {
    checkCompatibility(2)
        .then(isCompatible => {
            if (!isCompatible) {
                renderUnsupportedError(document.querySelector(".error-messages"), "Spectating");
            } else {
                API.joinGame(gameId, true)
                    .then(response => {
                        saveToStorage("gameId", response["gameId"]);
                        saveToStorage("playerToken", response["playerToken"]);
                        location.href = "./board.html";
                    }).catch(err => renderErrorMessage(err));
            }
        });
}

function stopSpectating() {
    location.href = "./join-game.html";
}

export { spectateGame, stopSpectating };