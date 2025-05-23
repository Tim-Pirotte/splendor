import { MAX_PRESTIGE_POINTS } from "../config.js";
import { getRandomNumber, getSortedResults } from "./helper.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import {
    INTERVAL_BETWEEN_ANIMATING_IMAGES,
    TIMEOUT_BEFORE_ANIMATED_IMAGE_DELETION,
    IMAGE_PATHS_FROM_RESULTS_PAGE,
} from "./config.js";
import { formatNumber } from "../board-component/renderer/helper.js";
import { insertImageInto } from "../utils/renderer.js";
import { locateToMainMenu } from "../utils/data-handler.js";
import { isSpectator } from "../board-component/state-machine/state-machine.js";
import { playEffect } from "../sound-component/sound.js";

function renderResultMessage(isWinner) {
    const $h1 = document.querySelector("h1");
    const $img = $h1.querySelector("img");

    if (isWinner) {
        $h1.querySelector("source").srcset = "../assets/images/results/winner_text.webp";
        $img.src = "../assets/images/fallback/results/winner_text.png";
        $img.title = $img.alt = "winner text";
    } else {
        $h1.querySelector("source").srcset = "../assets/images/results/defeat_text.webp";
        $img.src = "../assets/images/fallback/results/defeat_text.png";
        $img.title = $img.alt = "defeat text";
    }
}

function renderResults() {
    if (loadFromStorage("gameId") === null) {locateToMainMenu(); return;}
    getSortedResults().then(gameResults => {
        const playerName = loadFromStorage("playerName");

        for (const player of gameResults) {

            if (playerName === player.name) {
                renderResultMessage(player.isWinner);
                renderResultAnimation(player.isWinner);
                playSound(player.isWinner);
            }
        }
        renderResultTable(gameResults);
    });
}

function renderResultTable(data) {
    const $template = document.querySelector("#result-template");
    const $tbody = document.querySelector("tbody");
    const clientPlayerName = loadFromStorage("playerName");

    $tbody.innerHTML = "";

    data.forEach(player => {
        const $clone = $template.content.firstElementChild.cloneNode(true);
        const $td = $clone.querySelectorAll("td");

        if (player.isWinner) $clone.classList.add("winner");
        if (player.name === clientPlayerName) $clone.classList.add("clientPlayer");
        insertImageInto($td[0], `results/${player.position}_place`, false, `number ${player.position}`);
        $td[1].textContent = player.name;
        $td[2].textContent = `${formatNumber(player.points)}/${MAX_PRESTIGE_POINTS}`;

        $tbody.appendChild($clone);
    });
}

function renderResultAnimation(isWinner) {
    if (isWinner) setInterval(renderOneAnimation, INTERVAL_BETWEEN_ANIMATING_IMAGES);

}

function renderOneAnimation() {
    const $animationDiv = document.createElement("div");
    const randomImage = IMAGE_PATHS_FROM_RESULTS_PAGE[Math.floor(getRandomNumber(IMAGE_PATHS_FROM_RESULTS_PAGE.length))];

    $animationDiv.classList.add("raining-animation");
    $animationDiv.style.left = `${getRandomNumber(100)}%`;
    $animationDiv.style.backgroundImage = `url("${randomImage}")`;

    document.querySelector("body").appendChild($animationDiv);

    setTimeout(() => $animationDiv.remove(), TIMEOUT_BEFORE_ANIMATED_IMAGE_DELETION);
}

function playSound(isWinner) {
    if (isWinner) playEffect("win", false);
}

export { renderResults };
