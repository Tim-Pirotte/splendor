import {processTakeTokenClick} from "./token/token-handler.js";

const ACTION_REGISTRY = {
  processTakeTokenClick: () => processTakeTokenClick(),
  processTakeNobleClick: () => processTakeNoble()
};

export {ACTION_REGISTRY};