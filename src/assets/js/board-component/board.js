import {getGems, updateGameData} from "./game-data-handler.js";
import {initGameStatusInterface} from "./game-status-interface.js";
import {tokenInit} from "./token/token.js";
import {noblesInit} from "./nobles/nobles.js";

function init() {
  getGems();
  updateGameData();
  initGameStatusInterface();
  tokenInit();
  noblesInit();
}

init();