import { avatars } from "../main-menu-component/data.js";
import {
    determinePlayerAvatar,
    getCurrentUsersAmount,
    getGameCreator,
    getGameId,
    getGameName,
    getMaxUsersAmount,
    getPlayersObjects,
} from "../utils/game-object-handler.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { copyNode } from "../utils/data-handler.js";
import { reflowCSS } from "../board-component/helper.js";
import { getContainerAnimationForLeaving } from "./helper.js";
import { LEAVING_PLAYER_ANIMATION_DURATION } from "../config.js";
import {safeEmptyContainer} from "../board-component/renderer/helper.js";

function renderGameInfo(g, started) {
    document.querySelector("#game-name-id").innerHTML = `${getGameName(g)} / <span>${getGameId(g)}</span>`;
    document.querySelector("h3").textContent = `Created by ${getGameCreator(g, started)}`;
}

function renderPlayersList(g, started) {
    const $template = document.querySelector("#joined-player-template");
    const $joinedPlayers = document.querySelector("#joined-players");
    const $joinedPlayerContainers = $joinedPlayers.querySelectorAll("li");
    const players = getPlayersObjects(g, started);

    for (const [index, player] of players.entries()) {
       let $player = $joinedPlayerContainers[index];

        if (!$player) {
            $player = document.createElement("li");
            $player.classList.add("player");

            $joinedPlayers.appendChild($player);
        }

        if (player.name === null) {
            removeRenderedPlayer($player)
        } else {
            /* these ?. operators are needed because:
            *  $player can be null if no players have been previously rendered at this position,
            *  .player-name doesn't exist of a player at this position has previously left */
            if (player.name !== $player?.querySelector(".player-name")?.innerText) {
                renderPlayer(player, $player, $template);
            }
        }
    }
}

function removeRenderedPlayer($container) {
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
    $container.animate(getContainerAnimationForLeaving($container), { duration: LEAVING_PLAYER_ANIMATION_DURATION });
    setTimeout(() => {
        safeEmptyContainer($container);
    }, LEAVING_PLAYER_ANIMATION_DURATION);
}

function renderPlayer(player, $container, $template) {
    const $li = copyNode($template);
    const avatar = determinePlayerAvatar(player.name, player.avatar);

    $li.querySelector(".player-name").textContent = player.name;
    $li.querySelector("source").srcset = `../assets/images/avatars/${avatar}.webp`;
    $li.querySelector("img").src = `../assets/images/fallback/avatars/${avatar}.png`;
    $li.querySelector("img").alt = $li.querySelector("img").title = avatar;

    $container.innerHTML =  $li.innerHTML;
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
