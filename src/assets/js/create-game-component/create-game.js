import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function init(){

    document.querySelector("form").addEventListener("submit", createGame);

}

function createGame(e){
    e.preventDefault();

    const visibilityList = document.querySelectorAll("input[name=visibility]");
    const amountOfPlayersList = document.querySelectorAll("input[name=players]");

    const gameName = document.querySelector("#game-name").value.trim(); // Adding the trim() to remove the extra spaces
    const visibility = getCheckedRadioValue(visibilityList);
    const amountOfPlayers = getCheckedRadioValue(amountOfPlayersList);

    createGameOnServer(gameName, visibility, amountOfPlayers);
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

    //fetchFromServer("/game", "POST", body)
}

init();