import { processCreateAndJoinResponse } from "../utils/response-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";

function handleCreateGameSubmit(e){
    e.preventDefault();

    const playerName = loadFromStorage("playerName");
    const gameName = (document.querySelector("#game-name").value || `${playerName}'s game`).trim();
    const visibility = getCheckedRadioValue(document.querySelectorAll("input[name=visibility]"));
    const numberOfPlayers = parseInt(getCheckedRadioValue(document.querySelectorAll("input[name=players]")));

    createGame(playerName, gameName, visibility, numberOfPlayers);
}

function createGame(playerName, gameName, visibility, numberOfPlayers){
    const body = formGameBody(playerName, gameName, visibility, numberOfPlayers);

    fetchFromServer("/games", "POST", body)
        .then(data => processCreateAndJoinResponse(data))
        .catch(error => console.error(error));
}

function getCheckedRadioValue(radioButtonList){
    for (const radioButton of radioButtonList) {
        if (radioButton.checked) { return radioButton.value; }
    }
    return null;
}

function formGameBody(playerName, gameName, visibility, numberOfPlayers){
    return gameName ? { gameName, numberOfPlayers, playerName }
                    : { numberOfPlayers, playerName };
}

export { handleCreateGameSubmit, getCheckedRadioValue, formGameBody };
