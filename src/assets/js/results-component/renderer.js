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
import { copyNode, locateToMainMenu } from "../utils/data-handler.js";
import { effects } from "../sound-component/sound.js";

function renderResultMessage(isWinner) {
    const $message = copyNode(document.querySelector("#result-message-template"));
    const $target = document.querySelector("header");
    const message = isWinner ? "winner" : "defeat";

    insertImageInto($message, `results/${message}_text`, true, message );

    $target.innerHTML = $message.outerHTML;
}

function renderResults() {
    if (loadFromStorage("gameId") === null) {locateToMainMenu(); return;}
    getSortedResults().then(gameResults => {
        const playerName = loadFromStorage("playerName");

        for (const player of gameResults) {
            if (player.name === playerName) {
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
    if (isWinner) effects.playWin();
}

export { renderResults };
