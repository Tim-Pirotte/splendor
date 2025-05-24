import * as API from "../api.js";
import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderErrorMessage } from "../utils/renderer.js";
import { renderPlayerInfo } from "./renderer.js";
import { validatePlayerName } from "./validator.js";
import { spectateBotGameById } from "../join-game-component/helper.js";
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

    if (document.querySelector("form").reportValidity() && validatePlayerName(playerName)) {
        savePlayerInfoToLocalStorage(playerName);

        if (["join-game", "create-game"].includes(e.target.value)) {
            location.href = `./pages/${e.target.value}.html`;
        }

        if (e.target.value === "demo") {
            startBotGame();
        }
    } else {
        renderErrorMessage("Invalid playername: (no spaces or special characters).");
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
        }).then(response => spectateBotGameById(response["gameId"]));
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

export { updateSelectedAvatar, toggleAvatarListVisibility, savePlayerInfo, closeAvatarVisibility };
