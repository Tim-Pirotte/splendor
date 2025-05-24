import * as API from "../api.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderPlayerInfo } from "./renderer.js";
import { isValidPlayerName } from "./validator.js";
import { spectateGameById } from "../join-game-component/helper.js";
import { LEVEL_OF_BOTS_IN_BOT_GAME, NUMBER_OF_PLAYERS_IN_BOT_GAME } from "../config.js";

function toggleAvatarListVisibility(e) {
    document.querySelector(".avatar-selector section").classList.toggle("none");
}

function updateSelectedAvatar(e) {
    const $avatar = e.target.closest("img");

    if (!$avatar) return;

    saveToStorage("avatar", $avatar.title);
    renderPlayerInfo();
    toggleAvatarListVisibility();
}

function addBotsToTheGame(level, gameId, amountToAdd) {
    if (amountToAdd === 1) return API.joinBot(level, gameId);

    return API.joinBot(Math.max(level, 1), gameId).then(() => addBotsToTheGame(level - 1, gameId, amountToAdd - 1));
}

function savePlayerInfo(e) {
    e.preventDefault();

    const playerName = document.querySelector("#username").value.trim();

    if (isValidPlayerName(playerName)) {
        savePlayerInfoToLocalStorage(playerName);

        switch (e.target.value) {
        case "join-game":
            goToJoinPageWithGetParameter();
            break;
        case "create-game":
            location.href = "./pages/create-game.html";
            break;
        default:
            startBotGame();
            break;
        }
    }
}

function saveUserName(e) {
    const playerName = e.target.value;

    if (isValidPlayerName(playerName)) saveToStorage("playerName", playerName);
}

function goToJoinPageWithGetParameter() {
    const gameIdParameter = new URL(window.location.href).searchParams.get("gameId");

    if (gameIdParameter) {
        location.href = `./pages/join-game.html?gameId=${gameIdParameter}`;
    } else {
        location.href = "./pages/join-game.html";
    }
}

function startBotGame() {
    API.createBotGame(LEVEL_OF_BOTS_IN_BOT_GAME, NUMBER_OF_PLAYERS_IN_BOT_GAME)
        .then(response => {
            return addBotsToTheGame(
                LEVEL_OF_BOTS_IN_BOT_GAME,
                response["gameId"],
                NUMBER_OF_PLAYERS_IN_BOT_GAME - 1,
            );
        }).then(response => spectateGameById(response["gameId"]));
}

function savePlayerInfoToLocalStorage(playerName) {
    saveToStorage("playerName", playerName);
    saveToStorage("avatar", document.querySelector("#avatar img").alt);
}

function closeAvatarVisibility(e) {
    if (e.target.closest("button")?.getAttribute("id") === "avatar") {
        toggleAvatarListVisibility(e);
        return;
    }

    if (
        !document.querySelector(".avatar-selector section").classList.contains("none")
        && !e.target.closest(".avatar-selector")
    ) {
        toggleAvatarListVisibility(e);
    }
}

export { updateSelectedAvatar, toggleAvatarListVisibility, savePlayerInfo, closeAvatarVisibility, saveUserName };
