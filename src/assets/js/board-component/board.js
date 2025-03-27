import {getGems, updateGameData} from "./game-data-handler.js";
import {initGameStatusInterface} from "./game-status-interface.js";
import {tokenInit} from "./token/token.js";
import {buyInit} from "./buy/buy.js";
import {handlePaymentMethodChange} from "./buy/buy-handler.js";

function init() {
  getGems();
  updateGameData();
  initGameStatusInterface();
  initializeActions();
}

function initializeActions() {
  tokenInit();
  buyInit();
}

init();