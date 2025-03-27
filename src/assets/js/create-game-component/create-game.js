import { navigateToMain } from "../utils/navigation.js";
import { renderPlayerInformation } from "../utils/player-renderer.js";
import { handleCreateGameSubmit } from "./handler.js";

function init(){
    renderPlayerInformation();

    document.querySelector("#back-button").addEventListener("click", navigateToMain);
    document.querySelector("form").addEventListener("submit", handleCreateGameSubmit);
}

init();
