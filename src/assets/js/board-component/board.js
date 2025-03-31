import { updateGameData } from "./game-data-handler.js";
import { initGameStatusInterface } from "./game-status-interface.js";
import { tokenInit } from "./token/token.js";
import { buyInit } from "./buy/buy.js";
import { noblesInit } from "./nobles/nobles.js";
import {DEVELOPMENT_CARDS, NOBLES} from "./data.js";

function init() {
    updateGameData();
    initGameStatusInterface();
    initializeActions();
}

function initializeActions() {
    tokenInit();
    noblesInit();
    buyInit();
}

init();
