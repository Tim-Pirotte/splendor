import { getGems, updateGameData } from "./game-data-handler.js";
import { initGameStatusInterface } from "./game-status-interface.js";
import { tokenInit } from "./token/token.js";
import { noblesInit } from "./nobles/nobles.js";
import { reserveInit } from "./reserve/reserver.js";

function init() {
  getGems();
  updateGameData();
  initGameStatusInterface();
  tokenInit();
  reserveInit();
  noblesInit();
}

init();
