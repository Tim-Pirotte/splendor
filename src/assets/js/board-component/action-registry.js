import { processBuyCardClick } from "./buy/buy-handler.js";
import { processSkipTurn, processTakeTokensClick, processTakeTwoTokens } from "./token/token-handler.js";
import { processTakeNoble } from "./nobles/nobles-handler.js";
import {processDiscardTokens} from "./token/discard.js";

const ACTION_REGISTRY = {
    processTakeTokenClick: () => processTakeTokensClick(),
    processTakeTwoTokensClick: () => processTakeTwoTokens(),
    processBuyCardClick: () => processBuyCardClick(),
    skipTurn: () => processSkipTurn(),
    processTakeNoble: () => processTakeNoble(),
    processDiscardTokens: () => processDiscardTokens(),
    doNothing: () => {},
};

export { ACTION_REGISTRY };
