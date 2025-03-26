import {MINTOKENSFORPICKINGTWO,gameId} from "./config.js";
import {fetchFromServer} from "../../data-connector/api-communication-abstractor.js";


function canGetToken(tokenType) {
    if (tokenType === "Gold") {
        return false;
    }
}

function selectToken(e) {
    const selectedToken = e.target.closest("li");
    if (canGetToken(selectedToken.dataset.type)) {
        // Do something
    }
}
function decreaseTokenValue(){
    let value = selectedToken.querySelector("p").innerText.substr(0 , 1);
    const amount = selectedToken.querySelector("p").innerText.substr(1 , 2)
    let tokenType = selectedToken.dataset.type
    console.log(value);
    value = parseInt(value);
    if (value<MINTOKENSFORPICKINGTWO ) {
        console.log("te weing tokens over kies een andere");
    }else if( tokenType === "Gold"){
        console.log("je kan geen joker pakke dummie");
    }
    else{
        value = value -2;
        addTokenChangToServer(tokenType);
    }

    selectedToken.querySelector("p").innerText = value.toString()+ amount;
    selectedToken.style.border = "none";
    selectedToken = ""

}
function addTokenChangToServer(tokenType) {
    let game = fetchFromServer(`/games/${gameId}`,`GET`)
    if (game.players.tokens.contain(tokenType)) {
        game.players.tokens[tokenType] = game.players.tokens[tokenType] + 2;
    }
    else{
        game.players.tokens.add(tokenType,2);
    }
}
export {selectToken,decreaseTokenValue};
