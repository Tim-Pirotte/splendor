import {renderList} from "./renderer.js";
import {playerJoinGame, handleFilterChange} from "./handler.js";

function init(){
    
    renderList();

    document.querySelector("ul").addEventListener("click", playerJoinGame);

    document.querySelector("#amount-filter").addEventListener("change", handleFilterChange);
    document.querySelector("#filter-form").addEventListener("submit", handleFilterChange);
}

init();
