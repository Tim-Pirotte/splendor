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
        };
    } else {
        body = {
            "numberOfPlayers": amountOfPlayers,
            "playerName": playerName
        };
    }

    return body;
}


export { getCheckedRadioValue, formGameBody };