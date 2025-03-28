import { setActionButtonState } from "../game-status-interface.js";
import { GAME_STATE } from "./data.js";


function initRoundBegin(gameData){

    const gameState = gameData["gameState"];
    sessionStorage.setItem("gameState", gameState);

    if(gameState === GAME_STATE.WINNER_IS_FOUND) {
        location.href = "./results.html";
    } else if(!gameData["started"]) {
        location.href = "./lobby-page.html";
    } else {
        setActionButtonState("skip turn", "skipTurn", {});
    }
    
}

export { initRoundBegin };