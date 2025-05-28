import { effects } from "../sound-component/sound.js";
import { renderResults } from "./renderer.js";
import {initController} from "../controller-component/controller.js";

function resultsInit() {
    renderResults();
    setupSound();
    initController();
}

function setupSound() {
    document.querySelector("#return-to-menu").addEventListener("click", effects.playClick);
}

resultsInit();
