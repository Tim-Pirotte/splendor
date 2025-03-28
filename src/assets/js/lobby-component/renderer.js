import { getCurrentUsersAmount, getGameCreator, getGameId, getGameName, getMaxUsersAmount, getPlayersObjects } from "../utils/game-object-handler.js";
import {safeEmptyContainer} from "../board-component/renderer/helper.js";

function renderHeader(g) {
    document.querySelector("#game-name-id").innerHTML = `${getGameName(g)} / <span>${getGameId(g)}</span>`;
    document.querySelector("h3").textContent =  `Created by ${getGameCreator(g)}`;
}

function renderPlayers(g) {
    const $template = document.querySelector("#joined-player-template");
    const $joinedPlayers = document.querySelector("#joined-players");

    safeEmptyContainer($joinedPlayers);

    getPlayersObjects(g).forEach(player => renderPlayer($template, $joinedPlayers, player));
}

function renderPlayer($template, $container, playerName) {
    const $li = $template.content.firstElementChild.cloneNode(true);

    $li.querySelector(".player-name").textContent = playerName;
    // picture tag needs to be filled,
    // at the moment its hardcoded in the template!

    $container.insertAdjacentHTML("beforeend", $li.outerHTML);
}

function renderPlayerCount(g) {
        document.querySelector("#player-count").textContent =
        `${getCurrentUsersAmount(g)} / ${getMaxUsersAmount(g)}`;
}

export { renderHeader, renderPlayers, renderPlayerCount };
