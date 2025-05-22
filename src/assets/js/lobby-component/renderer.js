import {
    determinePlayerAvatar,
    getCurrentUsersAmount,
    getGameCreator,
    getGameId,
    getGameName,
    getMaxUsersAmount,
    getPlayersObjects,
} from "../utils/game-object-handler.js";
import { copyNode, getAmountOfTemplateTags } from "../utils/data-handler.js";
import { reflowCSS } from "../board-component/helper.js";
import { getContainerAnimationForLeaving, hasSomethingRenderedInside, isAddBotButton } from "./helper.js";
import { LEAVING_PLAYER_ANIMATION_DURATION } from "../config.js";
import { safeEmptyContainer } from "../board-component/renderer/helper.js";
import { checkCompatibilityFromSessionStorage } from "../server-version-component/server-version.js";

function renderGameInfo(gameObject, started) {
    document.querySelector("#game-name-id").innerHTML = `${getGameName(gameObject)} / <span>${getGameId(gameObject)}</span>`;
    document.querySelector("h3").textContent = `Created by ${getGameCreator(gameObject, started)}`;
}

function renderLobbyPlayers(gameData, started) {
    const $joinedPlayersContainer = document.querySelector("#joined-players");

    renderPlayerContainers(gameData.numberOfPlayers, $joinedPlayersContainer);
    renderPlayersList(gameData, started);
    if(checkCompatibilityFromSessionStorage(2)) renderBotPlaceHolders($joinedPlayersContainer);
}

function renderPlayerContainers(amountOfPlayers, $joinedPlayersContainer) {
    if ($joinedPlayersContainer.childElementCount === (getAmountOfTemplateTags($joinedPlayersContainer) + amountOfPlayers)) return;

    for (let i = 0; i < amountOfPlayers; i++) {
        const $player = document.createElement("li");
        $player.classList.add("player");

        $joinedPlayersContainer.appendChild($player);
    }
}

function renderBotPlaceHolders($joinedPlayersContainer) {
    const $playerContainers = $joinedPlayersContainer.querySelectorAll("li");
    let aBotHasBeenRendered = false;

    for (const $container of $playerContainers) {
        if (isAddBotButton($container) && aBotHasBeenRendered) {
            safeEmptyContainer($container);
        }

        if ($container.childElementCount === 0 && !aBotHasBeenRendered) {
            renderAddBot($container);
            aBotHasBeenRendered = true;
        }

        if (isAddBotButton($container)) aBotHasBeenRendered = true;
    }
}

function renderAddBot($container) {
    $container.classList.add("add-bot");
    $container.innerHTML = copyNode(document.querySelector("#add-bot-template")).innerHTML;
}

function renderPlayersList(gameObject, started) {
    const $template = document.querySelector("#joined-player-template");
    const $joinedPlayerContainers = document.querySelector("#joined-players").querySelectorAll("li");

    getPlayersObjects(gameObject, started)
        .then(players => {
            for (const [index, player] of players.entries()) {
                const $player = $joinedPlayerContainers[index];

                if (player.name === null && !isAddBotButton($player) && hasSomethingRenderedInside($player)) {
                    removeRenderedPlayer($player);
                }

                if (player.name !== null && player.name !== $player?.querySelector(".player-name")?.innerText) {
                    renderPlayer(player, $player, $template);
                }
            }
        });
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

    $container.classList.remove("add-bot");
    $container.innerHTML = $li.innerHTML;
}

function renderPlayerCount(gameObject) {
    document.querySelector("#player-count").textContent = `${getCurrentUsersAmount(gameObject)} / ${getMaxUsersAmount(gameObject)}`;
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

export {
    renderGameInfo,
    renderPlayersList,
    renderPlayerCount,
    setCopyGameIdImageColor,
    renderGameStartingCountdown,
    renderPlayerContainers,
    renderLobbyPlayers,
};
