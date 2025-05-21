import { checkCompatibility } from "../server-version-component/server-version.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderErrorMessage, renderUnsupportedError } from "../utils/renderer.js";
import * as API from "../api.js";

function spectateGame(gameId) {
    checkCompatibility(2)
        .then(isCompatible => {
            if (!isCompatible) {
                renderUnsupportedError(document.querySelector(".error-message"), "Spectating");
            } else {
                API.joinGame(gameId, true, false)
                    .then(response => {
                        saveToStorage("gameId", response["gameId"]);
                        saveToStorage("playerToken", response["playerToken"]);
                        location.href = "./lobby.html";
                    }).catch(err => renderErrorMessage(err.cause));
            }
        });
}

export { spectateGame };