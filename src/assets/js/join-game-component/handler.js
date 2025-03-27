import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {processResponse} from "../general-logic/join-create-game.js";
import { renderList } from "./renderer.js";

function playerJoinGame(e) {
    e.preventDefault();

    if (e.target.type === "button") {
        const gameId = e.target.closest("li").dataset.gameId;
        const playerName = loadFromStorage("playerName");

        fetchFromServer(`/games/${gameId}/players/${playerName}`, "POST")
            .then(res => processResponse(res));
    }
}

function playerJoinGameById(e) {
    e.preventDefault();

    const gameId = document.querySelector("#game-id").value;
    const playerName = loadFromStorage("playerName");

    fetchFromServer(`/games/${gameId}/players/${playerName}`, "POST")
        .then(res => processResponse(res));

}

function handleFilterChange(e) {
    e.preventDefault();

    renderList();
}

export { playerJoinGame, playerJoinGameById, handleFilterChange };
