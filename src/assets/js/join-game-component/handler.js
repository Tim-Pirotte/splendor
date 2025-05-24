import { joinGameById, spectateGameById } from "./helper.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function joinGameUsingUsersInputId(e) {
    e.preventDefault();

    joinGameById(document.querySelector("#game-id").value, true);
}

function joinGame(e) {
    e.preventDefault();

    if (e.target.type === "button") {
        const gameState = e.target.closest("li").dataset.gameState;
        const gameId = e.target.closest("li").dataset.gameId;

        if(gameState === "join") {
            joinGameById(gameId, false);
        } else {
            spectateGameById(gameId);
        }
    }
}

function joinGameByIdParameter(gameId) {
    const playerName = loadFromStorage("playerName");

    if (playerName === null) {
        sendBackToMainMenuWithGameId(gameId);
        return;
    }

    joinGameById(gameId, true, true);
}

function sendBackToMainMenuWithGameId(gameId) {
    location.href = `../index.html?gameId=${gameId}`;
}

export { joinGameUsingUsersInputId, joinGame, joinGameByIdParameter, sendBackToMainMenuWithGameId };
