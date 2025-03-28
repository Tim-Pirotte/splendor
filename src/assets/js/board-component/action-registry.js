import {processBuyCardClick} from "./buy/buy-handler.js";
import {processSkipTurn, processTakeTokensClick, processTakeTwoTokens} from "./token/token-handler.js";
import { processTakeNoble } from "./nobles/nobles-handler.js";

const ACTION_REGISTRY = {
  processTakeTokenClick: () => processTakeTokensClick(),
  processTakeTwoTokensClick: () => processTakeTwoTokens(),
  processBuyCardClick: () => processBuyCardClick(),
  skipTurn: () => processSkipTurn(),
  processTakeNoble: () => processTakeNoble(),
};

export { ACTION_REGISTRY };
