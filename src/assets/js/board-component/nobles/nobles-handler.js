import {setActionButtonState} from "../game-status-interface.js";
import {fetchFromServer} from "../../data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {NOBLES} from "../data.js";

function selectNoble(e) {
  const $selectedNoble = e.target.closest("li");
  setActionButtonState("Take Noble", "processTakeNoble", {name: $selectedNoble.dataset.name});
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