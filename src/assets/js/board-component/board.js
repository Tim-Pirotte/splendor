import { getGems, updateGameData } from "./game-data-handler.js";
import { initGameStatusInterface } from "./game-status-interface.js";
import { tokenInit } from "./token/token.js";
import { buyInit } from "./buy/buy.js";
import { noblesInit } from "./nobles/nobles.js";
import {DEVELOPMENT_CARDS, NOBLES} from "./data.js";

function init() {
    getGems();
    updateGameData();
    initGameStatusInterface();
    initializeActions();
    sortAndPrint(DEVELOPMENT_CARDS, "name")
}

function initializeActions() {
    tokenInit();
    noblesInit();
    buyInit();
}

function sortAndPrint(objects, attribute) {
    if (!Array.isArray(objects) || objects.length === 0) {
        console.log("Invalid input: Provide a non-empty array of objects.");
        return;
    }

    if (!(attribute in objects[0])) {
        console.log(`Invalid attribute: '${attribute}' not found in objects.`);
        return;
    }

    const sortedObjects = [...objects].sort((a, b) => {
        if (a[attribute] < b[attribute]) return -1;
        if (a[attribute] > b[attribute]) return 1;
        return 0;
    });

    console.log(JSON.stringify(sortedObjects, null, 4));
}

init();
