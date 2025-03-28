import {processTakeTokensClick, processTakeTwoTokens} from "./token/token-handler.js";
import { processTakeNoble } from "./nobles/nobles-handler.js";

const ACTION_REGISTRY = {
  processTakeTokenClick: () => processTakeTokensClick(),
  processTakeTwoTokensClick: () => processTakeTwoTokens(),
  skipTurn: () => {},
  processTakeNoble: () => processTakeNoble(),
};

export { ACTION_REGISTRY };
