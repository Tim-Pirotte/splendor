import {getGems, updateGameData} from "./game-data-handler.js";
import {getGameCreator, initGameStatusInterface, setActionButtonState} from "./game-status-interface.js";

function init() {
  getGems();
  updateGameData();
  updateGameData();
  setActionButtonState("Alert test", "takeTokens", {});
  initGameStatusInterface();
}

init();