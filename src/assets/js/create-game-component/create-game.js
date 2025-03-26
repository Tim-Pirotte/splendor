import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { saveToStorage, loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function init(){

    document.querySelector("form").addEventListener("submit", createGame);

    //saveToStorage("playerName", "Johny");

}

function createGame(e){
    e.preventDefault();

    const visibilityList = document.querySelectorAll("input[name=visibility]");
    const amountOfPlayersList = document.querySelectorAll("input[name=players]");

    const gameName = document.querySelector("#game-name").value.trim(); // Adding the trim() to remove the extra spaces
    const visibility = getCheckedRadioValue(visibilityList);
    const amountOfPlayers = parseInt(getCheckedRadioValue(amountOfPlayersList));

    createGameOnServer(gameName, visibility, amountOfPlayers);

    // Redirect naar de loby page
}

function getCheckedRadioValue(radioButtonList){

    for(const radioButton of radioButtonList){
        if(radioButton.checked){
            return radioButton.value;
        }
    }

}

function formGameBody(playerName, gameName, visibility, amountOfPlayers){
    
    let body;

    if( gameName !== ""){ // The there is a gameName
        body = {
            "gameName": gameName,
            "numberOfPlayers": amountOfPlayers,
            "playerName": playerName
        }
    } else {
        body = {
            "numberOfPlayers": amountOfPlayers,
            "playerName": playerName
        }
    }

    return body;
}


function createGameOnServer(gameName, visibility, amountOfPlayers){

    const playerName = loadFromStorage("playerName");
    const body = formGameBody(playerName, gameName, visibility, amountOfPlayers);

    console.log(body);

    fetchFromServer("/games", "POST", body)
    .then(data => console.log(`Succeded the game creation ${data}`));
}

init();