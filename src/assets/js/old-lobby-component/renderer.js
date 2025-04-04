/*import { getCurrentUsersAmount, getGameCreator, getGameId, getGameName, getMaxUsersAmount, getPlayersObjects } from "../utils/game-object-handler.js";
import { safeEmptyContainer } from "../board-component/renderer/helper.js";
import { copyNode } from "../utils/data-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { avatars } from "../old-main-menu-component/data.js";

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
    const $li = copyNode($template);
    let avatar = loadFromStorage("avatar");

    if (playerName !== loadFromStorage("playerName")) {
        avatar = avatars[playerName.toLowerCase().charCodeAt(0) % avatars.length];
    }

    $li.querySelector(".player-name").textContent = playerName;
    $li.querySelector("source").srcset = `../assets/images/avatars/${avatar}.webp`;
    $li.querySelector("img").src = `../assets/images/fallback/avatars/${avatar}.png`;
    $li.querySelector("img").alt = $li.querySelector("img").title = avatar;

    $container.appendChild($li);
}

function renderPlayerCount(g) {
    document.querySelector("#player-count").textContent =
        `${getCurrentUsersAmount(g)} / ${getMaxUsersAmount(g)}`;
}

export { renderHeader, renderPlayers, renderPlayerCount };
*/