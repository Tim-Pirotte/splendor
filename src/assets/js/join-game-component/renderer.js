import * as objectHandler from "./object-handler.js";
import {getAmountText, getGameButtonText} from "./helper.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import { filterGameList } from "./filterer.js";


function renderList(){

    const $template = document.querySelector("#game-template");
    const $container = document.querySelector("ul");

    // Remove the previous games
    $container.querySelectorAll("li").forEach(li => li.remove());
    
    fetchFromServer(`/games`, `GET`)
        .then(gameObject => {
            const filterestList = filterGameList(gameObject['games']);
            if(filterestList.length === 0){
                //Render a message
                renderNoGames($container);
            }else {
                filterestList.forEach(game => populateGame($template, $container, game));
            }
            
        })
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

function renderNoGames($container){
    const messageItem = `<li><p>There are no games based on your selections</p></li>`;
    $container.insertAdjacentHTML("beforeend", messageItem);
}

export {renderList};
