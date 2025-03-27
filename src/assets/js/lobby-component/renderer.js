import {getCurrentUsersAmount, getGameCreator, getGameId, getGameName, getMaxUsersAmount, getPlayersObjects} from "../general-logic/object-handler.js";

function renderHeader(g) {
    document.querySelector("#game-name-id").innerHTML = `${getGameName(g)} <span$>${getGameId(g)}</span>`;
    document.querySelector("h3").innerHTML =  `Created by ${getGameCreator(g)}`;
}

function renderPlayers(g) {
    const $template = document.querySelector("#joined-player-template");
    const $container = document.querySelector("#joined-players");

    document.querySelectorAll("#players li")
        .forEach(li => li.remove());

    getPlayersObjects(g).forEach(player => renderPlayer($template, $container, player));
}

function renderPlayer($template, $container, playerName) {
    const $li = $template.content.firstElementChild.cloneNode(true);

    $li.querySelector(".player-name").innerHTML = playerName;
    // picture tag needs to be filled,
    // at the moment its hardcoded in the template!

    $container.insertAdjacentHTML("beforeend", $li.outerHTML);
}

function renderPlayerCount(g) {
        document.querySelector("#player-count").textContent =
        `${getCurrentUsersAmount(g)} / ${getMaxUsersAmount(g)}`;
}

export {renderHeader, renderPlayers, renderPlayerCount};
