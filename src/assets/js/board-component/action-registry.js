import {processTakeTokenClick} from "./token/token-handler.js";
import {processTakeNoble} from "./nobles/nobles-handler.js";

const ACTION_REGISTRY = {
  processTakeTokenClick: () => processTakeTokenClick(),
  skipTurn: () => {},
  processTakeNoble: () => processTakeNoble(),
};

export {ACTION_REGISTRY};