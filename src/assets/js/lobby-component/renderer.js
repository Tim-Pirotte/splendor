import {getGameCreator, getGameId, getGameName} from "../general-logic/object-handler.js";

function renderHeader(g) {
    document.querySelector("header").insertAdjacentHTML("beforeend",
        `<h1>Lobby</h1>
         <h2 id="game-name">${getGameName(g)} <span id="game-id">${getGameId(g)}</span></h2>
         <h3>Created by ${getGameCreator(g)}</h3>`);
}

export {renderHeader};
