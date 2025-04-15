import { MAX_PRESTIGE_POINTS } from "../config.js";
import { getSortedResults } from "./helper.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { LOSER_ANIMATION_IMAGES, WINNER_ANIMATION_IMAGES } from "./config.js";

function renderResultMessage(isWinner) {
    const $status = document.querySelector("h1");
    $status.textContent = isWinner ? "WINNER" : "DEFEAT";
}

function renderResults() {
    getSortedResults().then(gameResults => {
        for (const player of gameResults) {
            const isPlayer = player.name === loadFromStorage("playerName");

            if (isPlayer) {
                renderResultMessage(isPlayer && player.isWinner);
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
        const $clone = $template.content.cloneNode(true);
        const $td = $clone.querySelectorAll("td");

        $td[1].textContent = player.name;
        $td[2].textContent = `${player.points}/${MAX_PRESTIGE_POINTS}`;

        $tbody.appendChild($clone);
    });
}

function renderResultAnimation(isWinner) {
    const imageArray = isWinner ? WINNER_ANIMATION_IMAGES : LOSER_ANIMATION_IMAGES;
    setInterval(renderOneAnimation, 50, imageArray);
}

function renderOneAnimation(imageArray) {
    //TODO correctly adjust the formula (now it can overflow on the right but not on the left)
    const $animationDiv = document.createElement("div");
    const randomImage = imageArray[Math.floor(Math.random() * imageArray.length)];

    $animationDiv.classList.add("animated");
    $animationDiv.style.left = `${Math.random() * 100}%`;
    $animationDiv.style.backgroundImage = `url("${randomImage}")`;

    document.querySelector("body").appendChild($animationDiv);

    // The animation lasts 3 second!!!
    setTimeout(() => $animationDiv.remove(), 3100);
}

export { renderResults };
