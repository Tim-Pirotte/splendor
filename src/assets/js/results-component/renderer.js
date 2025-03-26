import { getResults } from "./helper.js";

function renderResultStatus(isWinner) {
    const $status = document.querySelector("h1");
    $status.innerText = isWinner ? "WINNER" : "DEFEAT";

};

function renderResultTable(data) {
    const $template = document.querySelector("#result-template");
    const $tbody = document.querySelector("tbody");

    $tbody.innerHTML = "";

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

function renderResults() {
    getResults().then(data => {
        renderResultStatus(data[0].name === "DFD");
        renderResultTable(data);
    });
};

export { renderResults };
