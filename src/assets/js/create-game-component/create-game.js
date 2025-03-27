import {handleCreateGameSubmit} from "./handler.js";
import {navigateToMain, renderPlayerInformation} from "../general-logic/join-create-game.js";

function init(){
    renderPlayerInformation();

    document.querySelector("#back-button").addEventListener("click", navigateToMain);
    document.querySelector("form").addEventListener("submit", handleCreateGameSubmit);
}

init();
