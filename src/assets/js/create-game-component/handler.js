import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {processResponse} from "../general-logic/join-create-game.js";

function handleCreateGameSubmit(e){
    e.preventDefault();

    const gameName = document.querySelector("#game-name").value.trim();
    const visibility = getCheckedRadioValue(document.querySelectorAll("input[name=visibility]"));
    const numberOfPlayers = parseInt(getCheckedRadioValue(document.querySelectorAll("input[name=players]")));

    createGame(gameName, visibility, numberOfPlayers);
}

function createGame(gameName, visibility, numberOfPlayers){
    const playerName = loadFromStorage("playerName");
    const body = formGameBody(playerName, gameName, visibility, numberOfPlayers);

    fetchFromServer("/games", "POST", body)
        .then(data => processResponse(data))
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

export {handleCreateGameSubmit, getCheckedRadioValue, formGameBody};
