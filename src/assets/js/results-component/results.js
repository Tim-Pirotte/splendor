import { soundInit } from "../sound-component/sound.js";
import { renderResults } from "./renderer.js";

function resultsInit() {
    renderResults();

    soundInit();
}

resultsInit();
