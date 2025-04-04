import * as API from "../api.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";

function getCheckedRadioButtonValue(buttonList){
    for (const button of buttonList) {
        if (button.checked) return button.value;
    }
}

function createGameWithBody(requestBody) {
    API.createGame(requestBody)
        .then(response => {
            saveToStorage("gameId", response["gameId"]);
            saveToStorage("playerToken", response["playerToken"]);
            location.href = "./lobby.html";
        });
}

export { getCheckedRadioButtonValue, createGameWithBody };
