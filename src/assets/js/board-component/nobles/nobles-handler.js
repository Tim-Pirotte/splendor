import {setActionButtonState} from "../game-status-interface.js";
import {fetchFromServer} from "../../data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";

function selectNoble(e) {
  const $selectedNoble = e.target.closest("li");
  console.log($selectedNoble);
  setActionButtonState("Take Noble", "processTakeNoble", {name: $selectedNoble.dataset.name});
}

function processTakeNoble() {
  const actionButton = document.querySelector(".action-button");
  console.log(actionButton.dataset.name);
  fetchFromServer(
    `/games/${loadFromStorage("gameId")}/players/${loadFromStorage("playerName")}/nobles`,
  "POST",
    {
      name: actionButton.dataset.name,
      prestigePoints: 0,
      neededBonuses: {
        Emerald: 0,
        Sapphire: 0,
        Ruby: 0,
        Diamond: 0,
        Onyx: 0,
        Gold: 0
      }
    }).then(res => console.log(res));
}

export { selectNoble, processTakeNoble };