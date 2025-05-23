import { EFFECTS_BASE_PATH } from "./config.js";
import {
    loadFromStorage,
    loadFromStorageWithDefault,
    saveToStorage,
} from "../data-connector/local-storage-abstractor.js";
import { setSoundButtonImgSource } from "./renderer.js";

const effects = {};
const background = document.querySelector("audio[autoplay]");

function soundInit() {
    setupSound();

    document.querySelector(".sound-button").addEventListener("click", () => {
        toggleSound();
        playEffect("button-press", false);
    });
}

function setupSound() {
    const state = loadFromStorageWithDefault("sound", false);

    if (background !== null) {
        background.volume = 0.20;
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
            background.muted = false;
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
    const state = !loadFromStorageWithDefault("sound", false);

    if (state) {
        if (background !== null) {
            background.play();
        }

        Object.values(effects)
            .filter(effect => effect.loop)
            .forEach(effect => effect.muted = false);
    } else {
        if (background !== null) {
            background.pause();
        }

        Object.values(effects)
            .forEach((effect) => {
                if (effect.loop) {
                    effect.muted = true;
                } else {
                    effect.pause();
                    effect.currentTime = 0;
                }
            });
    }

    saveToStorage("sound", state);
    setSoundButtonImgSource(state);
}

function playEffect(name, loop) {
    const state = loadFromStorage("sound");

    if (state || loop) { // if sound is disable create the loop effect but mute it
        if (effects[name] === undefined) {
            const audio = new Audio(`${EFFECTS_BASE_PATH}${name}.mp3`);
            audio.loop = loop;
            effects[name] = audio;
        }

        if (effects[name].loop) {
            effects[name].currentTime = 0;
            effects[name].muted = ! state;
        }

        effects[name].play();
        return effects[name];
    }
}

function playTimer() {
    const effect = playEffect("timer", true);

    if (effect !== undefined) {
        effect.volume = 0.1;
    }
}

function stopTimer() {
    if ("timer" in effects) {
        const timer = effects["timer"];
        timer.pause();
        timer.currentTime = 0;
    }
}

function playClick(){
    playEffect("button-press", false);
}

export { soundInit, playEffect, playTimer, stopTimer, playClick };
