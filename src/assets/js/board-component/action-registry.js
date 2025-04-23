import { processBuyCardClick } from "./buy-reserve/buy-handler.js";
import { processSkipTurn, processTakeTokensClick, processTakeTwoTokens } from "./tokens/token-handler.js";
import { processTakeNoble } from "./nobles/nobles-handler.js";
import { processDiscardTokens } from "./tokens/discard.js";
import { stopSpectating } from "../join-game-component/spectate.js";

const ACTION_REGISTRY = {
    processTakeTokenClick: () => processTakeTokensClick,
    processTakeTwoTokensClick: () => processTakeTwoTokens,
    processBuyCardClick: () => processBuyCardClick,
    skipTurn: () => processSkipTurn,
    processTakeNoble: () => processTakeNoble,
    processDiscardTokens: () => processDiscardTokens,
    stopSpectating: () => stopSpectating,
    doNothing: () => {},
};

export { ACTION_REGISTRY };
