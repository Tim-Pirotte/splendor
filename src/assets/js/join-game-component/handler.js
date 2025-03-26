import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";
import { filterGameList } from "./filterer.js";

function playerJoinGame(e) {
    e.preventDefault();

    const gameId = e.target.closest("li").dataset.gameId;
    const playerName = loadFromStorage("playerName");

    fetchFromServer(`/games/${gameId}/players/${playerName}`, `POST`)
        .then(res => {
            saveToStorage("gameId", res.gameId);
            saveToStorage("playerToken", res.playerToken);
            window.location.href = `./lobby-page.html`; })
        .catch(error => console.error(error));
}


function handleFilterChange(e){
    e.preventDefault();

    console.log("We need to render the list again because we changed the filter data");
}


export {playerJoinGame, handleFilterChange};
