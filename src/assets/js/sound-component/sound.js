import { setupSound, toggleSound } from "./helper.js";

function soundInit () {
    setupSound();
    document.querySelector(".sound-button").addEventListener("click", toggleSound);
}

export { soundInit };