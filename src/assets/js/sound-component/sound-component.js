import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";

function init () {
    setupSound();
    document.querySelector(".sound-button").addEventListener("click", toggleSound);
}
function setupSound() {
    const sound = loadFromStorage("sound");
    if (sound === null) {
        saveToStorage("sound", "off");
    }
    setSoundButtonImgSource(sound);
}

function setSoundButtonImgSource(soundStatus) {
    const isFromIndex = document.querySelector(".sound-button").dataset.index === "true";
    document.querySelector(".sound-button source")
    .setAttribute("srcset", getSoundImagePath(isFromIndex,"webp", soundStatus));
    document.querySelector(".sound-button img")
    .setAttribute("src", getSoundImagePath(isFromIndex,"png", soundStatus));
}

function getSoundImagePath(fromIndex, extension, soundStatus) {
    return `${getSourcePrefix(fromIndex)}./assets/images/${insertFallbackIntoPathIfNeeded(extension)}UI/sound_${soundStatus}.${extension}`;
}

function getSourcePrefix(fromIndex) {
    if (fromIndex) {
        return "";
    } else {
        return ".";
    }
}
function insertFallbackIntoPathIfNeeded(extension) {
    if (extension === "png") {
        return "fallback/";
    } else {
        return "";
    }
}

function toggleSound() {
    const previousSoundStatus = loadFromStorage("sound");
    if(previousSoundStatus === "off") {
        saveToStorage("sound", "on");
        setSoundButtonImgSource("on");
    } else {
        saveToStorage("sound", "off");
        setSoundButtonImgSource("off");
    }
}

init();