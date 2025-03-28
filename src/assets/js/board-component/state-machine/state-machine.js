import { setActionButtonState } from "../game-status-interface.js";
import { GameState } from "./data.js";

function initRoundBegin(gameData){

    const gameState = gameData["gameState"];
    sessionStorage.setItem("gameState", gameState);

    if(gameState === GameState.WINNER_IS_FOUND) {
        location.href = `./results.html`;
    } else if(!gameData["started"]) {
        location.href = "./lobby-page.html";
    } else {
        setActionButtonState("skip turn", "skipTurn", {});
    }
    
}

export { initRoundBegin };