import {handleCreateGameSubmit} from "./handler.js";
import {navigateToMain} from "../general-logic/join-create-game.js";

function init(){
    document.querySelector("#back-button").addEventListener("click", navigateToMain);
    document.querySelector("form").addEventListener("submit", handleCreateGameSubmit);
}

init();
