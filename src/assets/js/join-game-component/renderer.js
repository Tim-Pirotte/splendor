import * as API from "../api.js";
import { getGameId, getGameName, getGameState } from "../utils/game-object-handler.js";
import { getAmountText, getGameButtonText } from "./helper.js";
import { filterGameList } from "./filter.js";

function renderList() {
    const $template = document.querySelector("#game-template");
    const $container = document.querySelector("ul");

    $container.querySelectorAll("li").forEach(li => li.remove());

    API.getGames().then(gameObject => {
            const filteredGames = filterGameList(gameObject["games"]);

            if (filteredGames.size === 0) {
                renderNoGamesFoundMessage($container);
            } else {
                filteredGames.forEach(game => populateGame($template, $container, game));
            }
    });
}

function populateGame($template, $container, game) {
    const $game = $template.content.firstElementChild.cloneNode(true);

    $game.dataset.gameState = getGameState(game);
    $game.dataset.gameId = getGameId(game);

    $game.querySelector("h3").textContent = getGameName(game);
    $game.querySelector(".game-id").textContent = getGameId(game);
    $game.querySelector(".amount-of-players").textContent = getAmountText(game);
    $game.querySelector("button").textContent = getGameButtonText(game);

    $container.insertAdjacentHTML("beforeend", $game.outerHTML);
}

function renderNoGamesFoundMessage($container) {
    const $message = document.querySelector("#no-games").content.firstElementChild.cloneNode(true);

    $message.querySelector("p").textContent = "There are no games based on your selections";

    $container.insertAdjacentHTML("beforeend", $message.outerHTML);
}

export { renderList };
