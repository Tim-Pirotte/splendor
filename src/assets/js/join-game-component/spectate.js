import { checkCompatibility } from "../server-version-component/server-version.js";
import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";
import { renderUnsupportedError } from "../utils/renderer.js";
import * as API from "../api.js";
import { renderErrorMessage } from "./renderer.js";

function spectateGame(gameId) {
    checkCompatibility(2)
        .then(isCompatible => {
            if (!isCompatible) {
                renderUnsupportedError(document.querySelector(".error-messages"), "Spectating");
            } else {
                API.joinGame(gameId, loadFromStorage("playerName"),true, false)
                    .then(response => {
                        saveToStorage("gameId", response["gameId"]);
                        saveToStorage("playerToken", response["playerToken"]);
                        location.href = "./lobby.html";
                    }).catch(err => renderErrorMessage(err));
            }
        });
}

export { spectateGame };