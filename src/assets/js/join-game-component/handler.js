import { joinGameById } from "./helper.js";

function locateToMainMenu(e) {
    location.href = "./../index.html";
}

function joinGameUsingId(e) {
    e.preventDefault();
    joinGameById(document.querySelector("#game-id").value);
}

function joinGameUsingGui(e) {
    e.preventDefault();
    if (e.target.type === "button") {
        joinGameById(e.target.closest("li").dataset.gameId);
    }
}

export { locateToMainMenu, joinGameUsingId, joinGameUsingGui };
