import { setActionButtonState } from "../game-status-interface.js";
import { GAME_STATE } from "./data.js";
import { isCurrentlyPlaying } from "../game-status-interface.js";
import { getActionButton } from "../game-status-interface.js";

function initRoundBegin(gameData){

    const gameState = gameData["gameState"];

    if(!gameData["started"]) {
        location.href = "./lobby-page.html";
    }

    if(!isCurrentlyPlaying()) {
        setActionButtonState("Wait until your turn", "doNothing", {});
        getActionButton().disabled = true;
        return;
    } else {
        getActionButton().disabled = false;
    }

    // Using the do nothing function because you cant skip this turn
    switch(gameState) {
    case GAME_STATE.WINNER_IS_FOUND:
        location.href = "./results.html";
        break;
    case GAME_STATE.CHOOSE_NOBEL:
        setActionButtonState("Choose a nobel", "doNothing", {});
        getActionButton().disabled = true;
        break;
    case GAME_STATE.RETURN_GEMS:
        setActionButtonState("Choose tokens to discard", "doNothing", {});
        getActionButton().disabled = true;
        break;
    default:
        setActionButtonState("skip turn", "skipTurn", {});

    }

}

function saveGameState(gameState) {
    sessionStorage.setItem("gameState", gameState);
}

export { initRoundBegin, saveGameState };
