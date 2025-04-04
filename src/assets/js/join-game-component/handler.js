import { joinGameById } from "./helper.js";

function joinGameUsingId(e) {
    joinGameById(document.querySelector("#game-id").value);
}

export { joinGameUsingId };
