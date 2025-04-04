import { joinGameById } from "./helper.js";

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
        joinGameById(e.target.closest("li").dataset.gameId);
    }
}

export { locateMainMenu, joinGameUsingUsersInputId, joinGame };
