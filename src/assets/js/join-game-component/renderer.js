import * as API from "../api.js";
import { getGameId, getGameName, getGameState } from "../utils/game-object-handler.js";
import { getAmountText, getGameButtonText } from "./helper.js";
import { filterGameList } from "./filter.js";
import {POLLING_TIME_OUT} from "../config.js";
import {safeEmptyContainer} from "../board-component/renderer/helper.js";
import {copyNode} from "../utils/data-handler.js";

function renderGameList() {
    const $template = document.querySelector("#game-template");
    const $container = document.querySelector("ul");
    const $gameListContainerCopy = $container.cloneNode(true);
    safeEmptyContainer($gameListContainerCopy);

    API.getGames().then(gameObject => {
            const filteredGames = filterGameList(gameObject["games"]);

            if (filteredGames.size === 0) {
                renderNoGamesFoundMessage($gameListContainerCopy);
            } else {
                filteredGames.forEach(game => populateGame($template, $gameListContainerCopy, game));
            }

            $container.innerHTML = $gameListContainerCopy.innerHTML;

            startGameListPolling();
        });
}

function startGameListPolling() {
    setTimeout(renderGameList, POLLING_TIME_OUT);
}

function populateGame($template, $container, game) {
    const $game = copyNode($template);

    $game.dataset.gameState = getGameState(game);
    $game.dataset.gameId = getGameId(game);

    $game.querySelector("h3").textContent = getGameName(game);
    $game.querySelector(".game-id").textContent = getGameId(game);
    $game.querySelector(".amount-of-players").textContent = getAmountText(game);
    $game.querySelector("button").textContent = getGameButtonText(game);

    $container.insertAdjacentHTML("beforeend", $game.outerHTML);
}

function renderNoGamesFoundMessage($container) {
    const $message = copyNode(document.querySelector("#no-games"));

    $message.querySelector("p").textContent = "There are no games based on your selections";

    $container.insertAdjacentHTML("beforeend", $message.outerHTML);
}

export { renderGameList };
