import {loadHeader, loadPlayerCount, loadPlayers} from "./handler.js";

function init() {
    loadHeader();
    loadPlayers();
    loadPlayerCount();
}

init();
