import { MAX_PRESTIGE_POINTS } from "../config.js";
import { getRandomNumber, getSortedResults } from "./helper.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import {
    INTERVAL_BETWEEN_ANIMATING_IMAGES,
    TIMEOUT_BEFORE_ANIMATED_IMAGE_DELETION,
    IMAGE_PATHS_FROM_RESULTS_PAGE,
} from "./config.js";

function renderResultMessage(isWinner) {
    const $status = document.querySelector("h1");
    $status.textContent = isWinner ? "WINNER" : "DEFEAT";
}

function renderResults() {
    getSortedResults().then(gameResults => {
        for (const player of gameResults) {
            const isPlayer = player.name === loadFromStorage("playerName");

            if (isPlayer) {
                renderResultMessage(player.isWinner);
                renderResultAnimation(player.isWinner);
            }
        }
        renderResultTable(gameResults);
    });
}

function renderResultTable(data) {
    const $template = document.querySelector("#result-template");
    const $tbody = document.querySelector("tbody");

    $tbody.innerHTML = "";

    data.forEach(player => {
        const $clone = $template.content.firstElementChild.cloneNode(true);
        const $td = $clone.querySelectorAll("td");

        if (player.isWinner) $clone.classList.add("winner");
        $td[0].textContent = player.position;
        $td[1].textContent = player.name;
        $td[2].textContent = `${player.points}/${MAX_PRESTIGE_POINTS}`;

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

export { renderResults };
