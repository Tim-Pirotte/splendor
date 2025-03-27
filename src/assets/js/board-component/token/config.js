import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";

const MIN_TOKENS_FOR_PICKING_TWO = 4;
const gameId = loadFromStorage("gameId");
export { MIN_TOKENS_FOR_PICKING_TWO, gameId  };