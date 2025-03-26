import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { saveToStorage, loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { getCheckedRadioValue, formGameBody } from "./helper.js";

function init(){

    document.querySelector("form").addEventListener("submit", handleCreateGameSubmit);

    //saveToStorage("playerName", "Johny");

}

function handleCreateGameSubmit(e){
    e.preventDefault();

    const visibilityList = document.querySelectorAll("input[name=visibility]");
    const amountOfPlayersList = document.querySelectorAll("input[name=players]");

    const gameName = document.querySelector("#game-name").value.trim(); // Adding the trim() to remove the extra spaces
    const visibility = getCheckedRadioValue(visibilityList);
    const amountOfPlayers = parseInt(getCheckedRadioValue(amountOfPlayersList));

    createGame(gameName, visibility, amountOfPlayers);
}






function createGame(gameName, visibility, amountOfPlayers){

    const playerName = loadFromStorage("playerName");
    const body = formGameBody(playerName, gameName, visibility, amountOfPlayers);

    console.log(body);

    fetchFromServer("/games", "POST", body)
    .then(data => {
        // Rederict to the loby page
    });
}

init();