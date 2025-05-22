import { EFFECTS_BASE_PATH } from "./config.js";
import { loadFromStorageWithDefault, saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { setSoundButtonImgSource } from "./renderer.js";

const effects = {};
const background = document.querySelector("audio[autoplay]");

function soundInit () {
    setupSound();

    document.querySelector(".sound-button").addEventListener("click", toggleSound);
}

function setupSound() {
    const state = loadFromStorageWithDefault("sound", false);

    if (background !== null){
        if (state) {
            background.play().then(() => { // check if autoplay is allowed
                background.muted = false;
                setSoundButtonImgSource(true);
            }).catch(e => { // autoplay is blocked
                saveToStorage("sound", false);
                setSoundButtonImgSource(false);
            });
        } else { // autoplay is allowed, but user muted audio
            background.pause();
            background.currentTime = 0;

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
        if (background !== null){
            background.play();
            background.muted = false;
        }
    } else {
        Object.values(effects).forEach((effect) => { // stop effects when mute btn pressed
            effect.pause();
            effect.currentTime = 0;
        });

        if (background !== null){
            background.pause();
            background.muted = true;
        }
    }

    saveToStorage("sound", state);
    setSoundButtonImgSource(state);
}

function playEffect(effect) {
    if (!(effect in effects)) {
        effects[effect] = new Audio(`${EFFECTS_BASE_PATH}${effect}.mp3`);
    }
    effects[effect].play();
}

export { soundInit, playEffect };
