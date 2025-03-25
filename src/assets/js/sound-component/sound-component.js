import { soundButtonImagesPaths } from "./sound-Component-config.js";
import * as localStorageAbstractor from "../data-connector/local-storage-abstractor.js"
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";

function init () {
    setupSound();
    document.querySelector(".sound-button").addEventListener("click", toggleSound)
}
function setupSound() {
    console.log('test')
    const soundEnabled = localStorageAbstractor.loadFromStorage("soundEnabled");
    if (soundEnabled === null) {
        localStorageAbstractor.saveToStorage("soundEnabled", "false");
    } else if (soundEnabled === "true") {
        setSoundButtonImgSource(getSoundStatus(soundEnabled));
    }
}

function setSoundButtonImgSource(soundStatus) {
    const isFromIndex = document.querySelector(".sound-button").dataset.index === "True";
    document.querySelector(".sound-button source")
    .setAttribute("srcset", getSoundImagePath(isFromIndex,"webp", soundStatus));
    document.querySelector(".sound-button img")
    .setAttribute("src", getSoundImagePath(isFromIndex,"png", soundStatus));
}

function getSoundImagePath(fromIndex, extension, soundStatus) {
    if (fromIndex) {
        return soundButtonImagesPaths[extension][soundStatus];
    } else {
        return `.${soundButtonImagesPaths[extension][soundStatus]}`;
    }
}

function getSoundStatus(soundEnabled) {
    if (soundEnabled === "true") {
        return "enabled";
    } else {
        return "disabled";
    }
}

function toggleSound() {
    const previousSoundStatus = localStorageAbstractor.loadFromStorage("soundEnabled");
    if(previousSoundStatus === "false") {
        localStorageAbstractor.saveToStorage("soundEnabled", "true");
        setSoundButtonImgSource("enabled")
    } else {
        localStorageAbstractor.saveToStorage("soundEnabled", "false");
        setSoundButtonImgSource("disabled")
    }

}

init()