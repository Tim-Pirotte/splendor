import { setActionButtonState, getActionButton, isCurrentlyPlaying } from "../game-status-interface.js";
import { GAME_STATE } from "./data.js";
import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { checkCompatibility } from "../../server-version-component/server-version.js";

function initRoundBegin(gameData) {
    const gameState = gameData["gameState"];

    if (!gameData["started"]) {location.href = "./lobby-page.html"; return;}

    switch (gameState) {
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

    setSpectatorState(gameData, loadFromStorage("playerName"));

}

function setSpectatorState(gameData, playerName) {
    checkCompatibility(2)
        .then(isCompatible => {
            if (isCompatible && isSpectator(gameData["spectators"], playerName)) {
                setActionButtonState("Stop spectating", "stopSpectating", {});
                getActionButton().disabled = false;
            };
        });
}

function isSpectator(spectators, playerName) {
    return spectators.includes(playerName);
}

function saveGameState(gameState) {
    sessionStorage.setItem("gameState", gameState);
}

function saveCurrentPlayerAndGameStateInDom(gameState) {
    const $body = document.querySelector("body");
    $body.classList.toggle("client-player-turn-action", isClientPlayerTurnAction(gameState));
}

function isClientPlayerTurnAction(gameState) {
    return gameState["currentPlayer"] === loadFromStorage("playerName") && gameState["gameState"] === GAME_STATE.TURN_ACTION;
}

export { initRoundBegin, saveGameState, saveCurrentPlayerAndGameStateInDom };
