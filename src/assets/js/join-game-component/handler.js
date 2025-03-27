import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { processResponse } from "../general-logic/join-create-game.js";
import { renderList } from "./renderer.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function playerJoinGame(e) {
    e.preventDefault();

    if (e.target.type === "button") {
        const gameId = e.target.closest("li").dataset.gameId;

        fetchFromServer(`/games/${gameId}/players/${loadFromStorage("playerName")}`, "POST")
            .then(res => processResponse(res));
    }
}

function playerJoinGameById(e) {
    e.preventDefault();

    const gameId = document.querySelector("#game-id").value;

    fetchFromServer(`/games/${gameId}/players/${loadFromStorage("playerName")}`, "POST")
        .then(res => processResponse(res));

}

function handleFilterChange(e) {
    e.preventDefault();

    renderList();
}

export { playerJoinGame, playerJoinGameById, handleFilterChange };
