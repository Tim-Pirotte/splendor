import {getGameId, getGameName, getGameState} from "../general-logic/object-handler.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {getAmountText, getGameButtonText} from "./helper.js";

function renderList(){
    const $template = document.querySelector("#game-template");
    const $container = document.querySelector("ul");

    $container.innerHTML = "";

    fetchFromServer(`/games`, `GET`)
        .then(gameObject => gameObject['games'].forEach(game => populateGame($template, $container, game)));
}

function populateGame($template, $container, game){
    const $game = $template.content.firstElementChild.cloneNode(true);

    $game.dataset.gameState = getGameState(game);
    $game.dataset.gameId = getGameId(game);

    $game.querySelector("h3").textContent = getGameName(game);
    $game.querySelector(".game-id").textContent = getGameId(game);
    $game.querySelector(".amount-of-players").textContent = getAmountText(game);
    $game.querySelector("button").textContent = getGameButtonText(game);

    $container.insertAdjacentHTML("beforeend", $game.outerHTML);
}

export {renderList};
