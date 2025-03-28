import {setActionButtonState} from "../game-status-interface.js";

function selectNoble(e) {
  const $selectedNoble = e.target.closest("li");
  console.log($selectedNoble);
  setActionButtonState("Take Noble", "processTakeNoble", {});
}

function processTakeNoble() {
  console.log("test");
}

export { selectNoble, processTakeNoble };