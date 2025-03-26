import {getAmountText, getGameButtonText} from "./helper.js";
import * as objectHandler from "./object-handler.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor";

function renderList(){
    const $template = document.querySelector("#game-template");
    const $container = document.querySelector("ul");
    //const gameObject = fetchFromServer();

    document.querySelectorAll("li")
        .forEach(li => li.remove());

    gameObject['games'].forEach(game => populateGame($template, $container, game));
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
