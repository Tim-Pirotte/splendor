import {processTakeTokenClick} from "./token/token-handler.js";

const ACTION_REGISTRY = {
  processTakeTokenClick: () => processTakeTokenClick(),
  processBuyCardClick: () => processBuyCardClick(),
};

export {ACTION_REGISTRY};