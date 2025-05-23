import * as API from "../api.js"
import { joinGameById, spectateGameById } from "./helper.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {locateToMainMenu} from "../utils/data-handler.js";
import {getLinkWithGameIdParam} from "../lobby-component/helper.js";

function joinGameUsingUsersInputId(e) {
    e.preventDefault();

    joinGameById(document.querySelector("#game-id").value, true);
}

function joinGame(e) {
    e.preventDefault();

    if (e.target.type === "button") {
        const gameState = e.target.closest("li").dataset.gameState;
        const gameId = e.target.closest("li").dataset.gameId;

        if(gameState === "join") {
            joinGameById(gameId, false);
        } else {
            spectateGameById(gameId);
        }
    }
}

function joinGameByIdParameter(gameId) {
    const playerName = loadFromStorage("playerName");

    if (playerName === null) {
        sendBackToMainMenuWithGameId(gameId);
        return;
    }

    API.joinGame(gameId, playerName, true, false);
}

function sendBackToMainMenuWithGameId(gameId) {
    location.href = getLinkWithGameIdParam("index", gameId);
}

export { joinGameUsingUsersInputId, joinGame, joinGameByIdParameter };
