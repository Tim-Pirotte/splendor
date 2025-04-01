import { updateGameData } from "./game-data-handler.js";
import { initGameStatusInterface } from "./game-status-interface.js";
import { tokenInit } from "./token/token.js";
import { buyReserveInit } from "./buy-reserve/buyReserve.js";
import { noblesInit } from "./nobles/nobles.js";

function init() {
    updateGameData();
    initGameStatusInterface();
    initializeActions();
}

function initializeActions() {
    tokenInit();
    noblesInit();
    buyReserveInit();
}

init();
