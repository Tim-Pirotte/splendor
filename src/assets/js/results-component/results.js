import { effects } from "../sound-component/sound.js";
import { renderResults } from "./renderer.js";

function resultsInit() {
    renderResults();
    setupSound();
}

function setupSound() {
    document.querySelector("#return-to-menu").addEventListener("click", effects.playClick);
}

resultsInit();
