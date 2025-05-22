import * as API from "../api.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { checkCompatibility } from "../server-version-component/server-version.js";

function getCheckedRadioButtonValue(buttonList){
    for (const button of buttonList) {
        if (button.checked) return button.value;
    }
}

function createGameWithBody(requestBody) {
    API.createGame(requestBody)
        .then(response => {
            checkCompatibility(2)
                .then(isCompatible => {
                    saveData(response, isCompatible);
                    location.href = "./lobby.html";
                });
        });
}

function saveData(response, isCompatible) {
    if (isCompatible) saveToStorage("timeSync", response["gameId"]);
    saveToStorage("gameId", response["gameId"]);
    saveToStorage("playerToken", response["playerToken"]);
    saveToStorage("playerName", response["playerName"]);
}

export { getCheckedRadioButtonValue, createGameWithBody };
