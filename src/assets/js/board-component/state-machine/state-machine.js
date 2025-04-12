import { setActionButtonState, getActionButton, isCurrentlyPlaying } from "../game-status-interface.js";
import { GAME_STATE } from "./data.js";

function initRoundBegin(gameData){
    const gameState = gameData["gameState"];

    if(!gameData["started"]) location.href = "./lobby-page.html";

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
        getActionButton().disabled = false;
    }

    if (!isCurrentlyPlaying()) {
        setActionButtonState("Wait your turn", "doNothing", {});
        getActionButton().disabled = true;
    }
}

function saveGameState(gameState) {
    sessionStorage.setItem("gameState", gameState);
}

export { initRoundBegin, saveGameState };
