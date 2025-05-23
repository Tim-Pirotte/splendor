import { joinGameById, spectateGameById } from "./helper.js";

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
    joinGameById(gameId)
}

export { joinGameUsingUsersInputId, joinGame, joinGameByIdParameter };
