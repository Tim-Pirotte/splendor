import * as API from "../api.js";
import { processCreateAndJoinResponse } from "../utils/response-handler.js";
import { renderList } from "./renderer.js";

function playerJoinGame(e) {
    e.preventDefault();

    if (e.target.type === "button") {
        const gameId = e.target.closest("li").dataset.gameId;
        joinGameRequest(gameId);
    }
}

function playerJoinGameById(e) {
    e.preventDefault();

    const gameId = document.querySelector("#game-id").value;
    joinGameRequest(gameId);
}

function handleFilterChange(e) {
    e.preventDefault();

    renderList();
}

function joinGameRequest(gameId) {
    API.joinGame(gameId)
        .then(res => processCreateAndJoinResponse(res))
        .catch(handleDuplicateNameError);
}

function handleDuplicateNameError(err) {
    const conflict = 409;

    if (err["failure"] === conflict) {
        document.querySelector(".error-messages").textContent = "Name is already taken";
    }
}

export { playerJoinGame, playerJoinGameById, handleFilterChange };
