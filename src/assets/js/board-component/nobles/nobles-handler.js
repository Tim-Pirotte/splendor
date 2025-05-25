import { NOBLES } from "../data.js";
import * as API from "../../api.js";
import { getActionButton, setActionButtonState } from "../game-status-interface.js";
import { binarySearchObjects } from "../../utils/data-handler.js";
import { effects } from "../../sound-component/sound.js";

function selectNoble(e) {
    const $selectedNoble = e.target.closest("li");

    if (!$selectedNoble) return;

    const nobleName = $selectedNoble.dataset.name;

    if (canSelectNoble(nobleName)) {
        setNobleHighlight($selectedNoble);
        setActionButtonState("Take Noble", "processTakeNoble", { name: nobleName });
        getActionButton().disabled = false;
    }
}

function canSelectNoble(nobleName) {
    const noble = getNobleByName(nobleName);
    const playerBonuses = getPlayerBonuses();

    for (const [nobleBonus, amount] of Object.entries(noble["neededBonuses"])) {
        if (playerBonuses[nobleBonus] < amount) return false;
    }

    return true;
}

function getPlayerBonuses() {
    const bonuses = {};
    document.querySelectorAll(".player-tokens ul > *").forEach(token => {
        if (token.dataset.type) {
            bonuses[token.dataset.type] = parseInt(token.dataset.bonuses);
        }
    });

    return bonuses;
}

function setNobleHighlight($nobleToSelect) {
    effects.playClick();
    for (const $noble of document.querySelectorAll(".nobles > li")) {
        $noble.classList.toggle("selected-noble", $noble === $nobleToSelect);
    }
}

function processTakeNoble() {
    const actionButton = getActionButton();
    const nobleToTake = getNobleByName(actionButton.dataset.name);

    API.takeNobles(nobleToTake);
}

function getNobleByName(name) {
    return binarySearchObjects(NOBLES, name, "name");
}

export { selectNoble, processTakeNoble, canSelectNoble };