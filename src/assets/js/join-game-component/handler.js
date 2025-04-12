import { joinGameById } from "./helper.js";
import { spectateGame } from "./spectate.js";

function locateMainMenu(e) {
    location.href = "./../index.html";
}

function joinGameUsingUsersInputId(e) {
    e.preventDefault();
    joinGameById(document.querySelector("#game-id").value);
}

function joinGame(e) {
    e.preventDefault();
    if (e.target.type === "button") {
        const gameState = e.target.closest("li").dataset.gameState;
        const gameId = e.target.closest("li").dataset.gameId;

        if( gameState === "join" ) {
            joinGameById(gameId);
        } else {
            spectateGame(gameId);
        }
    }
}

export { locateMainMenu, joinGameUsingUsersInputId, joinGame };
