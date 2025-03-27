import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { processResponse } from "../general-logic/join-create-game.js";
import { renderList } from "./renderer.js";


function playerJoinGame(e) {
    e.preventDefault();

    // Only join when you click the button
    if (e.target.type === "button") {
        const gameId = e.target.closest("li").dataset.gameId;
        const playerName = loadFromStorage("playerName");

        fetchFromServer(`/games/${gameId}/players/${playerName}`, `POST`)
            .then(res => processResponse(res))
            .catch(error => console.error(error));
    }

}


function handleFilterChange(e) {
    e.preventDefault();

    // rerender the list
    renderList();
}


export { playerJoinGame, handleFilterChange };
