function init(){

    document.querySelector("form").addEventListener("submit", createGame);

}

function createGame(e){
    e.preventDefault();

    const visibilityList = document.querySelectorAll("input[name=visibility]");
    const amountOfPlayersList = document.querySelectorAll("input[name=players]");

    const gameName = document.querySelector("#game-name").value;
    const visibility = getCheckedRadioValue(visibilityList);
    const amountOfPlayers = getCheckedRadioValue(amountOfPlayersList);


    console.log(amountOfPlayers);
}

function getCheckedRadioValue(radioButtonList){
    for(const radioButton of radioButtonList){
        if(radioButton.checked){
            return radioButton.value;
        }
    }
}


function createGameOnServer(gameName, visibility, amountOfPlayers){
    
}

init();