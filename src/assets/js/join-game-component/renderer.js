import {getGameId, getGameName, getGameState} from "../general-logic/object-handler.js";
import { getAmountText, getGameButtonText } from "./helper.js";
import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";
import { filterGameList } from "./filter.js";

function renderList() {
    const $template = document.querySelector("#game-template");
    const $container = document.querySelector("ul");

    $container.querySelectorAll("li").forEach(li => li.remove());

    fetchFromServer("/games")
        .then(gameObject => {
            const filterestList = filterGameList(gameObject['games']);
            if (filterestList.size === 0) {
                //Render a message
                renderNoGames($container);
            } else {
                filterestList.forEach(game => populateGame($template, $container, game));
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

function renderNoGames($container) {
    const $messageLi = document.querySelector("#no-games").content.firstElementChild.cloneNode(true);

    $messageLi.querySelector("p").innerText = "There are no games based on your selections";

    $container.insertAdjacentHTML("beforeend", $messageLi.outerHTML);
}

export { renderList };
