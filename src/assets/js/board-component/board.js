import { updateGameData } from "./game-data-handler.js";
import { initGameStatusInterface } from "./game-status-interface.js";
import { tokenInit } from "./token/token.js";
import { buyReserveInit } from "./buy-reserve/buy.js";
import { noblesInit } from "./nobles/nobles.js";
import { reserveInit } from "./reserve/reserve.js";

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
