import { renderAvatarSelectionList, renderPlayerInfo } from "./renderer.js";

function init() {
    console.log("ok");
    setupUI();
}

function setupUI() {
    renderAvatarSelectionList();
    renderPlayerInfo();
}

init();
