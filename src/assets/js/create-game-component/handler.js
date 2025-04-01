import * as API from "../api.js";
import { processCreateAndJoinResponse } from "../utils/response-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function handleCreateGameSubmit(e){
    e.preventDefault();

    const playerName = loadFromStorage("playerName");
    const gameName = (document.querySelector("#game-name").value || `${playerName}'s game`).trim();
    const visibility = getCheckedRadioValue(document.querySelectorAll("input[name=visibility]"));
    const numberOfPlayers = parseInt(getCheckedRadioValue(document.querySelectorAll("input[name=players]")));

    createGame(playerName, gameName, visibility, numberOfPlayers);
}

function createGame(playerName, gameName, visibility, numberOfPlayers){
    const requestBody = getGameBody(playerName, gameName, visibility, numberOfPlayers);

    API.createGame(requestBody)
        .then(data => processCreateAndJoinResponse(data))
        .catch(error => console.error(error));
}

function getCheckedRadioValue(radioButtonList){
    for (const radioButton of radioButtonList) {
        if (radioButton.checked) { return radioButton.value; }
    }

    return null;
}

function getGameBody(playerName, gameName, visibility, numberOfPlayers){
    const gameBody = { numberOfPlayers, playerName, returnExcessTokensRequired: true };
    if (gameName) gameBody["gameName"] = gameName;

    return gameBody;
}

export { handleCreateGameSubmit, getCheckedRadioValue, getGameBody };
