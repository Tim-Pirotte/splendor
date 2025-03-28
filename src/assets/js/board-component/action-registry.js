import {processTakeTokenClick, processTakeTwoTokens} from "./token/token-handler.js";
import { processTakeNoble } from "./nobles/nobles-handler.js";

const ACTION_REGISTRY = {
  processTakeTokenClick: () => processTakeTokenClick(),
  processTakeTwoTokensClick: () => processTakeTwoTokens(),
  skipTurn: () => {},
  processTakeNoble: () => processTakeNoble(),
};

export { ACTION_REGISTRY };
