import { setSoundButtonImgSource } from "./renderer.js";
import {
    loadFromStorageWithDefault,
    saveToStorage,
} from "../data-connector/local-storage-abstractor.js";
import { EFFECTS_BASE_PATH, EFFECTS_NAMES } from "./config.js";

const EFFECTS = {};
const BACKGROUND = document.querySelector("audio[autoplay]");

function setupSound() {
    EFFECTS_NAMES.forEach((effect) => {
        EFFECTS[effect] = new Audio(`${EFFECTS_BASE_PATH}/${effect}.mp3`);
    });

    const state = loadFromStorageWithDefault("sound", false);

    if (BACKGROUND !== null){
        if (state) {
            BACKGROUND.play().then(() => { // check if autoplay is allowed
                BACKGROUND.muted = false;
                setSoundButtonImgSource(true);
            }).catch(e => { // autoplay is blocked
                saveToStorage("sound", false);
                setSoundButtonImgSource(false);
            });
        } else { // autoplay is allowed, but user muted audio
            BACKGROUND.pause();
            BACKGROUND.currentTime = 0;

            saveToStorage(false);
            setSoundButtonImgSource(false);
        }
    } else {
        saveToStorage("sound", state);
        setSoundButtonImgSource(state);
    }
}

function toggleSound() {
    const state = ! loadFromStorageWithDefault("sound", false);

    if (state) {
        if (BACKGROUND !== null){
            BACKGROUND.play();
            BACKGROUND.muted = false;
        }
    } else {
        Object.values(EFFECTS).forEach((effect) => { // stop effects when mute btn pressed
            effect.pause();
            effect.currentTime = 0;
        });

        if (BACKGROUND !== null){
            BACKGROUND.pause();
            BACKGROUND.muted = true;
        }
    }

    saveToStorage("sound", state);
    setSoundButtonImgSource(state);
}

function getRelativePathIndicators(isUserOnIndexPage) {
    return isUserOnIndexPage ? "." : "..";
}

function playEffect(effect) {
    EFFECTS[effect].play();
}

export { setupSound, toggleSound, getRelativePathIndicators, playEffect };
