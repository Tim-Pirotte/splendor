import { setActionButtonState } from "../game-status-interface.js";
import { GAME_STATE } from "./data.js";
import { isCurrentlyPlaying } from "../game-status-interface.js";
import { ACTION_REGISTRY } from "../action-registry.js";
import { getActionButton } from "../game-status-interface.js";

function initRoundBegin(gameData){

    const gameState = gameData["gameState"];
    sessionStorage.setItem("gameState", gameState);

    if(!gameData["started"]) {
        location.href = "./lobby-page.html";
    }

    if(!isCurrentlyPlaying()) {
        setActionButtonState("Wait until your turn", "doNothing", {})
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
            break;
        case GAME_STATE.RETURN_GEMS:
            setActionButtonState("Chose tokens to discard", "doNothing", {});
            break;
        default:
            setActionButtonState("skip turn", "skipTurn", {});

    }

}

export { initRoundBegin };
