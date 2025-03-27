import { processJoinAndCreateResponse } from "../utils/response-handler.js";
import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { renderList } from "./renderer.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

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
    fetchFromServer(`/games/${gameId}/players/${loadFromStorage("playerName")}`, "POST")
        .then(res => processJoinAndCreateResponse(res))
        .catch(handleDuplicateNameError);
}

function handleDuplicateNameError(err) {
    const conflict = 409;

    if (err["failure"] === conflict) {
        document.querySelector(".error-messages").textContent = "Name is already taken";
    }
}

export { playerJoinGame, playerJoinGameById, handleFilterChange };
