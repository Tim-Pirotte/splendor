import { avatars } from "../main-menu-component/data.js";
import { getCurrentUsersAmount, getGameCreator, getGameId, getGameName, getMaxUsersAmount, getPlayersObjects } from "../utils/game-object-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { safeEmptyContainer } from "../board-component/renderer/helper.js";
import { copyNode } from "../utils/data-handler.js";

function renderGameInfo(g) {
    document.querySelector("#game-name-id").innerHTML = `${getGameName(g)} / <span>${getGameId(g)}</span> `;
    document.querySelector("h3").textContent = `Created by ${getGameCreator(g)}`;
}

function renderPlayersList(g) {
    const $template = document.querySelector("#joined-player-template");
    const $joinedPlayers = document.querySelector("#joined-players");

    safeEmptyContainer($joinedPlayers);
    getPlayersObjects(g).forEach(player => $joinedPlayers.appendChild(renderPlayer($template, player)));
}

function renderPlayer($template, playerName) {
    const $li = copyNode($template);
    const avatar = determinePlayerAvatar(playerName);

    $li.querySelector(".player-name").textContent = playerName;
    $li.querySelector("source").srcset = `../assets/images/avatars/${avatar}.webp`;
    $li.querySelector("img").src = `../assets/images/fallback/avatars/${avatar}.png`;
    $li.querySelector("img").alt = $li.querySelector("img").title = avatar;

    return $li;
}

function determinePlayerAvatar(playerName) {
    if (playerName === loadFromStorage("playerName")) {
        return loadFromStorage("avatar");
    }

    return avatars[playerName.toLowerCase().charCodeAt(0) % avatars.length];
}

function renderPlayerCount(g) {
    document.querySelector("#player-count").textContent = `${getCurrentUsersAmount(g)} / ${getMaxUsersAmount(g)}`;
}

export { renderGameInfo, renderPlayersList, renderPlayerCount };
