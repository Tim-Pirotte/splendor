import {handleCreateGameSubmit} from "./handler.js";

function init(){
    document.querySelector("form").addEventListener("submit", handleCreateGameSubmit);
}

init();
