import { getResults } from "./helper.js";
import { MAXPRESTIGEPOINTS } from "../config.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function renderResultMessage(isWinner) {
    const $status = document.querySelector("h1");
    $status.innerText = isWinner ? "WINNER" : "DEFEAT";
}

function renderResultTable(data) {
    const $template = document.querySelector("#result-template");
    const $tbody = document.querySelector("tbody");

    $tbody.innerHTML = "";

    data.forEach(player => {
        const $clone = $template.content.cloneNode(true);
        const $td = $clone.querySelectorAll("td");

        $td[1].textContent = player.name;
        $td[2].textContent = `${player.points}/${MAXPRESTIGEPOINTS}`;

        $tbody.appendChild($clone);
    });
}

function renderResults() {
    getResults().then(gameResults => {
        renderResultMessage(gameResults[0].name === loadFromStorage("playerName"));
        renderResultTable(gameResults);
    });
}

export { renderResults };
