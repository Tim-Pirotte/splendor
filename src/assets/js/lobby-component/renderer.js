import { avatars } from "../main-menu-component/data.js";
import { getCurrentUsersAmount, getGameCreator, getGameId, getGameName, getMaxUsersAmount, getPlayersObjects } from "../utils/game-object-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { safeEmptyContainer } from "../board-component/renderer/helper.js";
import { copyNode } from "../utils/data-handler.js";

function renderGameInfo(g, started) {
    document.querySelector("#game-name-id").innerHTML = `${getGameName(g)} / <span>${getGameId(g)}</span>`;
    document.querySelector("h3").textContent = `Created by ${getGameCreator(g, started)}`;
}

function renderPlayersList(g, started) {
    const $template = document.querySelector("#joined-player-template");
    const $joinedPlayers = document.querySelector("#joined-players");

    safeEmptyContainer($joinedPlayers);
    getPlayersObjects(g, started).forEach(player => $joinedPlayers.appendChild(renderPlayer($template, player)));
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

function setCopyGameIdImageColor(color) {
    const $copyButton = document.querySelector("#copy-game-id-button");
    $copyButton.querySelector("source").setAttribute(
        "srcset",
        `../assets/images/UI/copyButton/copy_button_${color}.webp`,
    );

    $copyButton.querySelector("img").setAttribute(
        "src",
        `../assets/images/fallback/UI/copyButton/copy_button_${color}.png`);
}

function renderGameStartingCountdown(count, $container) {
    if (count === 0) {location.href = "./board.html"; return}

    $container.innerText = count;

    $container.classList.remove("starting-countdown");
    $container.offsetHeight;
    $container.innerText = count;
    $container.classList.add("starting-countdown");

    setTimeout(renderGameStartingCountdown, 1000, count - 1, $container);
}

export { renderGameInfo, renderPlayersList, renderPlayerCount, setCopyGameIdImageColor, renderGameStartingCountdown };
