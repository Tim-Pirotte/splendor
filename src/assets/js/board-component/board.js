import {getGems, updateGameData} from "./game-data-handler.js";
import {tokenInit} from "./token/token.js";

function init() {
  getGems();
  updateGameData();
  tokenInit();
}

init();