import { avatars } from "../main-menu-component/data.js";
import {
    convertAvatarToCorrectCasing,
    getCurrentUsersAmount,
    getGameCreator,
    getGameId,
    getGameName,
    getMaxUsersAmount,
    getPlayersObjects
} from "../utils/game-object-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { copyNode } from "../utils/data-handler.js";
import { reflowCSS } from "../board-component/helper.js";

function renderGameInfo(g, started) {
    document.querySelector("#game-name-id").innerHTML = `${getGameName(g)} / <span>${getGameId(g)}</span>`;
    document.querySelector("h3").textContent = `Created by ${getGameCreator(g, started)}`;
}

function renderPlayersList(g, started) {
    const $template = document.querySelector("#joined-player-template");
    const $joinedPlayers = document.querySelector("#joined-players");
    getPlayersObjects(g, started, $joinedPlayers).forEach(player => $joinedPlayers.appendChild(renderPlayer($template, player)));
}

function renderPlayer($template, player) {
    console.log(player)
    const $li = copyNode($template);
    const avatar = determinePlayerAvatar(player.name, player.avatar);

    $li.querySelector(".player-name").textContent = player.name;
    $li.querySelector("source").srcset = `../assets/images/avatars/${avatar}.webp`;
    $li.querySelector("img").src = `../assets/images/fallback/avatars/${avatar}.png`;
    $li.querySelector("img").alt = $li.querySelector("img").title = avatar;

    return $li;
}

function determinePlayerAvatar(playerName, avatar) {
    if (playerName === loadFromStorage("playerName")) {
        return loadFromStorage("avatar");
    }

    if (avatar) {
        return convertAvatarToCorrectCasing(avatar);
    } else {
        return convertAvatarToCorrectCasing(avatars[playerName.toLowerCase().charCodeAt(0) % avatars.length]);
    }
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
    if (count === 0) {
        location.href = "./board.html";
        return;
    }

    $container.innerText = count;

    $container.classList.remove("starting-countdown");
    reflowCSS($container);
    $container.innerText = count;
    $container.classList.add("starting-countdown");

    setTimeout(renderGameStartingCountdown, 1000, count - 1, $container);
}

export { renderGameInfo, renderPlayersList, renderPlayerCount, setCopyGameIdImageColor, renderGameStartingCountdown };
