import {getGems, updateGameData} from "./game-data-handler.js";
import * as token from "./token/token.js";

function init() {
  getGems();
  updateGameData();
  token.init()
}

init();