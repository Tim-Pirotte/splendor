import { getDummyGames } from "./data.js";
import { getAmountText, getGameButtonText } from "./helper.js";
import * as objectHandler from "./object-handler.js"

/* 
This function will render the list of possible games
*/
function renderList(){
    const gameObject = getDummyGames();

    const $gameHolder = document.querySelector("ul");
    const $template = document.querySelector("#game-template");

    $gameHolder.innerHTML = "";

    gameObject['games'].forEach(game => {
        const $game = $template.content.firstElementChild.cloneNode(true);

        populateGame($game, game);

        console.log($game)
        $gameHolder.insertAdjacentHTML("beforeend", $game.outerHTML);
    });

}

function populateGame($game, game){
    $game.dataset.gameState = objectHandler.getGameState(game);
    $game.querySelector("h3").innerText = objectHandler.getGameName(game);
    $game.querySelector(".game-id").innerText = objectHandler.getGameId(game);
    $game.querySelector(".amount-of-players").innerText = getAmountText(game);
    $game.querySelector("button").innerText = getGameButtonText(game);

}

export { renderList }