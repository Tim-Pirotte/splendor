import {processTakeTokenClick} from "./token/token-handler.js";

const ACTION_REGISTRY = {
  processTakeTokenClick: () => processTakeTokenClick(),
  skipTurn: () => {}
};

export {ACTION_REGISTRY};