import * as API from "../api.js";
import { POLLING_TIME_OUT } from "../config.js";
import { copyNode } from "../utils/data-handler.js";
import { getCurrentUsersAmount, getGameId, getGameName, getGameState, getMaxUsersAmount } from "../utils/game-object-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { addImageToContainer } from "../utils/renderer.js";
import { filterGames } from "./gamefilter.js";
import {safeEmptyContainer} from "../board-component/renderer/helper.js";

function renderPlayerInfo() {
    const playerName = loadFromStorage("playerName");
    const avatar = loadFromStorage("avatar");

    document.querySelector("#playerName").textContent = playerName;
    addImageToContainer(document.querySelector("#playerInformation"), `avatars/${avatar}`, false, avatar);
}

function renderPublicGames() {
    const $template = document.querySelector("#game-template");
    const $gameList = document.querySelector("ul");
    const $gameListCopy = $gameList.cloneNode(true);

    safeEmptyContainer($gameListCopy);

    API.getGames().then(gameObject => {
        const gamesToRender = filterGames(gameObject["games"]);

        if (gamesToRender.size !== 0) {
            gamesToRender.forEach(game => $gameListCopy.appendChild(populateGame($template, game)));
        } else {
            $gameListCopy.insertAdjacentHTML("beforeend", "<p>There are no games based on your selections</p>");
        }

        $gameList.innerHTML = $gameListCopy.innerHTML;
        setTimeout(renderPublicGames, POLLING_TIME_OUT);
    });
}

function populateGame($template, game) {
    const $game = copyNode($template);

    $game.dataset.gameState = getGameState(game);
    $game.dataset.gameId = getGameId(game);

    $game.querySelector("h3").textContent = getGameName(game);
    $game.querySelector(".game-id").textContent = getGameId(game);
    $game.querySelector(".amount-of-players").textContent = `${getCurrentUsersAmount(game)}/${getMaxUsersAmount(game)}`;
    $game.querySelector("button").textContent = `${getGameState(game)} game`;

    return $game;
}

export { renderPlayerInfo, renderPublicGames };
