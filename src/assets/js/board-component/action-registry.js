import {processTakeTokenClick} from "./token/token-handler.js";
import {processBuyCardClick} from "./buy/buy-handler.js";
import {processTakeNoble} from "./nobles/nobles-handler.js";

const ACTION_REGISTRY = {
  processTakeTokenClick: () => processTakeTokenClick(),
  processBuyCardClick: () => processBuyCardClick(),
  skipTurn: () => {},
  processTakeNoble: () => processTakeNoble(),
};

export {ACTION_REGISTRY};