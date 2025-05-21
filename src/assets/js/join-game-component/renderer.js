import * as API from "../api.js";
import { ERROR_MESSAGE_TIMEOUT, JOIN_GAME_PAGE_POLLING_TIME_OUT } from "../config.js";
import { copyNode } from "../utils/data-handler.js";
import { getCurrentUsersAmount, getGameId, getGameName, getGameState, getMaxUsersAmount } from "../utils/game-object-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { filterGames } from "./gamefilter.js";
import { safeEmptyContainer } from "../board-component/renderer/helper.js";
import { insertImageInto } from "../utils/renderer.js";

function renderPlayerInfo() {
    const playerName = loadFromStorage("playerName");
    const avatar = loadFromStorage("avatar");

    document.querySelector("#playerName").textContent = playerName;
    insertImageInto(document.querySelector("#player-information"), `avatars/${avatar}`, false, avatar);
}

function renderPublicGames(e) {
    const wasTriggeredByPolling = e === undefined;

    if (!wasTriggeredByPolling && e.target.value !== "Reset") e.preventDefault();

    const $gameList = document.querySelector("ul");

    API.getGames().then(gameObject => {
        const gamesToRender = filterGames(gameObject["games"]);
        const amountOfGamesToRender = gamesToRender.size;

        if (amountOfGamesToRender) {
            const $template = document.querySelector("#game-template");
            const $gameListCopy = $gameList.cloneNode(true);

            safeEmptyContainer($gameListCopy);

            $gameList.dataset.renderedGames = amountOfGamesToRender;
            gamesToRender.forEach(game => $gameListCopy.appendChild(populateGame($template, game)));
            $gameList.innerHTML = $gameListCopy.innerHTML;

        } else {
            safeEmptyContainer($gameList);
            $gameList.insertAdjacentHTML("beforeend", "<p>There are no games based on your selections</p>");
        }

        if (wasTriggeredByPolling) setTimeout(renderPublicGames, JOIN_GAME_PAGE_POLLING_TIME_OUT);
    });
}

function populateGame($template, game) {
    const $game = copyNode($template);

    $game.dataset.gameState = getGameState(game);
    $game.dataset.gameId = getGameId(game);

    $game.querySelector("h3").textContent = getGameName(game);
    $game.querySelector(".amount-of-players").textContent = `${getCurrentUsersAmount(game)}/${getMaxUsersAmount(game)}`;
    $game.querySelector("button").textContent = `${getGameState(game)} game`;

    return $game;
}

function renderErrorMessage(err) {
    const $target = document.querySelector(".error-message");
    $target.classList.remove("none");
    $target.innerHTML = `<p>${err.cause}</p>`;

    setTimeout(() => $target.classList.add("none"), ERROR_MESSAGE_TIMEOUT);
}

export { renderPlayerInfo, renderPublicGames, renderErrorMessage };
