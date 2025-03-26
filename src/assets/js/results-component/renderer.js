import { getResults, getUser } from "./helper.js";


/**
 * Render the correct message
 * @param {*} isWinner inidicates whether current user is the winner
 */
function renderResultMessage(isWinner) {
    const $status = document.querySelector("h1");
    $status.innerText = isWinner ? "WINNER" : "DEFEAT";

};

/**
 * Render the current game results inside the table
 * @param {*} data current game results
 */
function renderResultTable(data) {
    const $template = document.querySelector("#result-template");
    const $tbody = document.querySelector("tbody");

    $tbody.innerHTML = ""; // clear the tbody content

    let pos = 1;
    data.forEach(player => {
        const $clone = $template.content.cloneNode(true);
        const $td = $clone.querySelectorAll("td");

        $td[0].innerText = pos;
        $td[1].innerText = player.name;
        $td[2].innerText = `${player.points}/15`;

        $tbody.appendChild($clone);
        pos++;
    });
};

/**
 * Render results page
 */
function renderResults() {
    getResults().then(data => {
        renderResultMessage(data[0].name === getUser());
        renderResultTable(data);
    });
};

export { renderResults };
