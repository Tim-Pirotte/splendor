import { effects, soundInit } from "../sound-component/sound.js";
import { renderResults } from "./renderer.js";

function resultsInit() {
    renderResults();
    setupSound();
}

function setupSound() {
    soundInit();
    document.querySelector("#return-to-menu").addEventListener("click", effects.playClick);
}

resultsInit();
