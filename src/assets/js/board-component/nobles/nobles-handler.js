import {setActionButtonState} from "../game-status-interface.js";
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
  console.log(playerBonuses);
  return false;
}

function getPlayerBonuses() {
  const bonuses = {};
  document.querySelectorAll(".player-tokens ul").forEach(token => {
    bonuses[token.dataset.type] = token.dataset.amount;
  })

  return bonuses;
}

function processTakeNoble() {
  const actionButton = document.querySelector(".action-button");
  const nobleToTake = getNobleByName(actionButton.dataset.name);
  console.log(nobleToTake)
  fetchFromServer(
    `/games/${loadFromStorage("gameId")}/players/${loadFromStorage("playerName")}/nobles`,
  "POST",
    nobleToTake)
    .then(res => console.log(res));
}

function getNobleByName(name) {
  return NOBLES.find(noble => noble.name === name);
}

export { selectNoble, processTakeNoble };