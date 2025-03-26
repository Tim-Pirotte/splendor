import * as communicationAbstractor from "../../data-connector/api-communication-abstractor.js";
import {loadFromStorage, saveToStorage} from "../../data-connector/local-storage-abstractor.js";
import {MINTOKENSFORPICKINGTWO} from "./config.js";

let selectedToken;
function selectToken(e) {
    e.preventDefault();
    console.log(e.target.closest("li"));

    selectedToken = e.target.closest("li");
    selectedToken.style.border = "1px solid red";

}
function decreaseTokenValue(){
    let value = selectedToken.querySelector("p").innerText.substr(0 , 1);
    const amount = selectedToken.querySelector("p").innerText.substr(1 , 2)

    console.log(value);
    value = parseInt(value);
    if (value<=MINTOKENSFORPICKINGTWO) {
        console.log("te weing tokens over kies een andere");
    }
    else{
        value = value -2;
    }

    selectedToken.querySelector("p").innerText = value.toString()+ amount;
    selectedToken.style.border = "none";
    selectedToken = ""

}
export {selectToken,decreaseTokenValue};
