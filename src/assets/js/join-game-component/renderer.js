import * as API from "../api.js";
import { JOIN_GAME_PAGE_POLLING_TIME_OUT } from "../config.js";
import { copyNode } from "../utils/data-handler.js";
import { getCurrentUsersAmount, getGameId, getGameName, getGameState, getMaxUsersAmount } from "../utils/game-object-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { filterGames } from "./gamefilter.js";
import { insertImageInto } from "../utils/renderer.js";
import { safeEmptyContainer } from "../board-component/renderer/helper.js";
import { checkCompatibility } from "../server-version-component/server-version.js";

function renderPlayerInfo() {
    const playerName = loadFromStorage("playerName");
    const avatar = loadFromStorage("avatar");

    document.querySelector("#playerName").textContent = playerName;
    insertImageInto(document.querySelector("#player-information"), `avatars/${avatar}`, false, avatar);
}

function initGameRendering(e) {
    const triggeredByPolling = e === undefined;

    if (!triggeredByPolling && e.target.value !== "Reset") e.preventDefault();

    checkCompatibility(2).then(isCompatible => { renderCompatibleGames(isCompatible); });

    if (triggeredByPolling) setTimeout(initGameRendering, JOIN_GAME_PAGE_POLLING_TIME_OUT);
}

function renderCompatibleGames(isCompatible) {
    API.getGames().then(gameObject => {
        const $gameList = document.querySelector("ul");
        const gamesToRender = filterGames(gameObject["games"], isCompatible);
        const numberOfGamesToRender = gamesToRender.size;

        if (numberOfGamesToRender) {
            renderGamesToList($gameList, gamesToRender, numberOfGamesToRender);

        } else {
            safeEmptyContainer($gameList);

            $gameList.insertAdjacentHTML("beforeend", "<p>There are no games based on your selections</p>");
        }
    });
}

function renderGamesToList($gameList, gamesToRender, numberOfGamesToRender) {
    const $template = document.querySelector("#game-template");
    const $gameListCopy = $gameList.cloneNode(true);

    safeEmptyContainer($gameListCopy);

    $gameList.dataset.renderedGames = numberOfGamesToRender;
    sortGames(gamesToRender).forEach(game => $gameListCopy.appendChild(populateGame($template, game)));
    $gameList.innerHTML = $gameListCopy.innerHTML;
}

function sortGames(games) {
    return Array.from(games).sort((game1, game2) => calculateGameSortingValue(game1) - calculateGameSortingValue(game2));
}

function calculateGameSortingValue(game) {
    return game.players.length / game.numberOfPlayers;
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

export { renderPlayerInfo, initGameRendering };
