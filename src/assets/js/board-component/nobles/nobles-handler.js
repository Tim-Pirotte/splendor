import {getActionButton, setActionButtonState} from "../game-status-interface.js";
import {fetchFromServer} from "../../data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {NOBLES} from "../data.js";

function selectNoble(e) {
  const $selectedNoble = e.target.closest("li");
  const nobleName = $selectedNoble.dataset.name;
  if (canSelectNoble(nobleName)) {
    setActionButtonState("Take Noble", "processTakeNoble", {name: nobleName});
  }
}

function canSelectNoble(nobleName) {
  const noble = getNobleByName(nobleName);
  const playerBonuses = getPlayerBonuses();

  for (const [nobleBonus, amount] of Object.entries(noble["neededBonuses"])) {
    if (playerBonuses[nobleBonus] < amount) {
      return false;
    }
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

function processTakeNoble() {
  const actionButton = getActionButton();
  const nobleToTake = getNobleByName(actionButton.dataset.name);
  fetchFromServer(
    `/games/${loadFromStorage("gameId")}/players/${loadFromStorage("playerName")}/nobles`,
  "POST",
    nobleToTake)
    .then(res => console.log(res));
}

function getNobleByName(name) {
  return binarySearchObjects(NOBLES, name, "name");
}

export { selectNoble, processTakeNoble };