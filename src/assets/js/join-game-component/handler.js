import { joinGameById } from "./helper.js";

function joinGameUsingId(e) {
    joinGameById(document.querySelector("#game-id").value);
}

function joinGameUsingGui(e) {
    if (e.target.type === "button") {
        joinGameById(e.target.closest("li").dataset.gameId);
    }
}

export { joinGameUsingId, joinGameUsingGui };
