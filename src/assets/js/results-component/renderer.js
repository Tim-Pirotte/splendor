import { getResults, getUser } from "./helper.js";
import { MAXPRESTIGEPOINTS } from "../config.js";

/**
 * Render the correct message
 * @param {*} isWinner inidicates whether current user is the winner
 */
function renderResultMessage(isWinner) {
    const $status = document.querySelector("h1");
    $status.innerText = isWinner ? "WINNER" : "DEFEAT";

}

/**
 * Render the current game results inside the table
 * @param {*} data current game results
 */
function renderResultTable(data) {
    const $template = document.querySelector("#result-template");
    const $tbody = document.querySelector("tbody");

    $tbody.innerHTML = "";

    let pos = 1;
    data.forEach(player => {
        const $clone = $template.content.cloneNode(true);
        const $td = $clone.querySelectorAll("td");

        $td[0].textContent = pos;
        $td[1].textContent = player.name;
        $td[2].textContent = `${player.points}/${MAXPRESTIGEPOINTS}`;

        $tbody.appendChild($clone);
        pos++;
    });
}

/**
 * Render results page
 */
function renderResults() {
    getResults().then(gameResults => {
        renderResultMessage(gameResults[0].name === getUser()); // check if first player is the current player
        renderResultTable(gameResults);
    });
};

export { renderResults };
