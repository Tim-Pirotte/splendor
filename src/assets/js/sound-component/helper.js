import { loadFromStorage, saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { setSoundButtonImgSource } from "./renderer.js";

function setupSound() {
    if (loadFromStorage("sound") === null) {
        saveToStorage("sound", "off");
    }

    setSoundButtonImgSource(loadFromStorage("sound"));
}

function toggleSound() {
    if(isSoundEnabled()) {
        saveToStorage("sound", "off");
    } else {
        saveToStorage("sound", "on");
    }

    setSoundButtonImgSource(loadFromStorage("sound"));
}

function isSoundEnabled() {
    return loadFromStorage("sound") === "on";
}

function getRelativePathIndicators(isUserOnIndexPage) {
    return isUserOnIndexPage ? "." : "..";
}

export { setupSound, toggleSound, getRelativePathIndicators };
