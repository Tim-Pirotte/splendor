import {getGems, updateGameData} from "./game-data-handler.js";

function init() {
  getGems();
  updateGameData();
}

init();