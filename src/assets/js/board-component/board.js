import {getGems, updateGameData} from "./game-data-handler.js";
import {getGameCreator, initGameStatusInterface, setActionButtonState} from "./game-status-interface.js";
import {tokenInit} from "./token/token.js";

function init() {
  getGems();
  updateGameData();
  updateGameData();
  setActionButtonState("Alert test", "takeTokens", {});
  initGameStatusInterface();
  tokenInit();
}

init();