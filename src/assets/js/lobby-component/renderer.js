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
import {getContainerAnimationForLeaving, getContainerToRenderPlayer} from "./helper.js";

function renderGameInfo(g, started) {
    document.querySelector("#game-name-id").innerHTML = `${getGameName(g)} / <span>${getGameId(g)}</span>`;
    document.querySelector("h3").textContent = `Created by ${getGameCreator(g, started)}`;
}

function renderPlayersList(g, started) {
    const $template = document.querySelector("#joined-player-template");
    const $joinedPlayers = document.querySelector("#joined-players");
    const $joinedPlayerContainers = $joinedPlayers.querySelectorAll("li");
    const players = getPlayersObjects(g, started);

    removeRenderedPlayers(players, $joinedPlayerContainers);

    renderNewPlayers(players, $joinedPlayerContainers, $template);
}

function renderPlayer(player, $joinedPlayerContainers, $template) {
    const $emptyJoinedPlayerContainer = getContainerToRenderPlayer($joinedPlayerContainers);

    const $li = copyNode($template);
    const avatar = determinePlayerAvatar(player.name, player.avatar);

    $li.querySelector(".player-name").textContent = player.name;
    $li.querySelector("source").srcset = `../assets/images/avatars/${avatar}.webp`;
    $li.querySelector("img").src = `../assets/images/fallback/avatars/${avatar}.png`;
    $li.querySelector("img").alt = $li.querySelector("img").title = avatar;

    $emptyJoinedPlayerContainer.innerHTML =  $li.innerHTML;
}

function removeRenderedPlayers(players, $joinedPlayerContainers) {
    for (const $container of $joinedPlayerContainers) {
        if (!$container.childNodes.length) continue;

        let playerInPlayers = false;

        for (const player of players) {
            if ($container.querySelector(".player-name").innerText === player.name) {
                player["alreadyRendered"] = true;
                playerInPlayers = true;
                break;
            }
        }

        if (!playerInPlayers) {
            //https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
            $container.animate(getContainerAnimationForLeaving($container), {duration: 500})
            setTimeout(() => {
                $container.innerHTML = "";
            }, 500);
        }
    }
}

function renderNewPlayers(players, $joinedPlayerContainers, $template) {
    for (const player of players) {
        if (!player["alreadyRendered"]) {
            renderPlayer(player, $joinedPlayerContainers, $template)
        }
    }
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
