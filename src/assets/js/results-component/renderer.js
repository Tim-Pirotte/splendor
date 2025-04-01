import { getResults } from "./helper.js";
import { MAX_PRESTIGE_POINTS } from "../config.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function renderResultMessage(isWinner) {
    const $status = document.querySelector("h1");
    $status.textContent = isWinner ? "WINNER" : "DEFEAT";
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

function renderResults() {
    getResults().then(gameResults => {
        for (const player of gameResults) {
            const isPlayer = player.name === loadFromStorage("playerName");
            if (isPlayer) renderResultMessage(isPlayer && player.isWinner);
        }
        renderResultTable(gameResults);
    });
}

export { renderResults };
