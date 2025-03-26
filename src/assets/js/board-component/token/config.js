import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";

const MINTOKENSFORPICKINGTWO = 4;
const gameId = loadFromStorage("gameId");
export { MINTOKENSFORPICKINGTWO,gameId };