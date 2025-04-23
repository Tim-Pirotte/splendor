import * as API from "../api.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { checkCompatibility } from "../server-version-component/server-version.js";

function getCheckedRadioButtonValue(buttonList){
    for (const button of buttonList) {
        if (button.checked) return button.value;
    }
}

function createGameWithBody(requestBody) {
    console.log(requestBody)
    API.createGame(requestBody)
        .then(response => {
            checkCompatibility(2)
                .then(isCompatible => {
                    if (isCompatible) saveToStorage("timeSync", response["gameId"]);
                    saveToStorage("gameId", response["gameId"]);
                    saveToStorage("playerToken", response["playerToken"]);
                    location.href = "./lobby.html";
                });
        });
}

export { getCheckedRadioButtonValue, createGameWithBody };
