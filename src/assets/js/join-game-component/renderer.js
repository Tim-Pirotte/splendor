import * as objectHandler from "../general-logic/object-handler.js";
import {getAmountText, getGameButtonText} from "./helper.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";

function renderList(){
    const $template = document.querySelector("#game-template");
    const $container = document.querySelector("ul");

    $container.innerHTML = "";

    fetchFromServer(`/games`, `GET`)
        .then(gameObject => gameObject['games'].forEach(game => populateGame($template, $container, game)))
        .catch(error => console.error(error));
}

function populateGame($template, $container, game){
    const $game = $template.content.firstElementChild.cloneNode(true);

    $game.dataset.gameState = objectHandler.getGameState(game);
    $game.dataset.gameId = objectHandler.getGameId(game);

    $game.querySelector("h3").textContent = objectHandler.getGameName(game);
    $game.querySelector(".game-id").textContent = objectHandler.getGameId(game);
    $game.querySelector(".amount-of-players").textContent = getAmountText(game);
    $game.querySelector("button").textContent = getGameButtonText(game);

    $container.insertAdjacentHTML("beforeend", $game.outerHTML);
}

export {renderList};
